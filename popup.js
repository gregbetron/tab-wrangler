document.addEventListener('DOMContentLoaded', function() {
  const closeTabsButton = document.getElementById('closeTabsButton');
  closeTabsButton.style.display = 'none'; // Initially hide the button

  function updateCloseButtonVisibility() {
    const checkedBoxes = document.querySelectorAll('#tabsList input[type="checkbox"]:checked');
    closeTabsButton.style.display = checkedBoxes.length > 0 ? 'block' : 'none';
  }

  // Store tab data for reordering
  let tabData = [];

  // Get the browser API (works for both Chrome and Firefox)
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  browserAPI.tabs.query({}, function(tabs) {
    const tabsList = document.getElementById('tabsList');
    tabData = tabs; // Store the tab data

    tabs.forEach((tab, index) => {
      const li = document.createElement('li');
      li.draggable = true;
      li.dataset.tabId = tab.id;
      li.dataset.index = index;
      
      // Drag and drop event handlers
      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragend', handleDragEnd);
      li.addEventListener('dragover', handleDragOver);
      li.addEventListener('dragenter', handleDragEnter);
      li.addEventListener('dragleave', handleDragLeave);
      li.addEventListener('drop', handleDrop);
      
      const leftContent = document.createElement('div');
      leftContent.className = 'left-content';
      
      const img = document.createElement('img');
      img.src = tab.favIconUrl || '';
      img.alt = '';
      img.style.width = '16px';
      img.style.height = '16px';
      img.style.marginRight = '8px';
      leftContent.appendChild(img);
      leftContent.appendChild(document.createTextNode(tab.title));
      
      const rightContent = document.createElement('div');
      rightContent.className = 'right-content';
      
      const refreshIcon = document.createElement('img');
      refreshIcon.src = 'icons/refresh.png';
      refreshIcon.alt = 'Refresh';
      refreshIcon.style.width = '16px';
      refreshIcon.style.height = '16px';
      refreshIcon.style.cursor = 'pointer';
      refreshIcon.onclick = function() {
        browserAPI.tabs.reload(tab.id);
      };
      rightContent.appendChild(refreshIcon);
      
      const trashIcon = document.createElement('img');
      trashIcon.src = 'icons/trash-solid.svg';
      trashIcon.alt = 'Close';
      trashIcon.style.width = '16px';
      trashIcon.style.height = '16px';
      trashIcon.style.cursor = 'pointer';
      trashIcon.onclick = function() {
        browserAPI.tabs.remove(tab.id);
        li.remove();
      };
      rightContent.appendChild(trashIcon);
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.tabId = tab.id;
      checkbox.addEventListener('change', updateCloseButtonVisibility);
      rightContent.appendChild(checkbox);
      
      li.appendChild(leftContent);
      li.appendChild(rightContent);
      tabsList.appendChild(li);
    });
  });

  // Drag and drop handlers
  function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.tabId);
    // Firefox requires this to be set
    e.dataTransfer.setData('application/x-moz-node', '');
  }

  function handleDragEnd(e) {
    this.classList.remove('dragging');
    // Remove all drop indicators
    document.querySelectorAll('#tabsList li.drop-indicator').forEach(item => {
      item.classList.remove('drop-indicator');
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const draggingItem = document.querySelector('.dragging');
    if (!draggingItem) return;

    const siblings = [...document.querySelectorAll('#tabsList li:not(.dragging)')];
    const closestItem = getClosestItem(siblings, e.clientY);
    
    // Remove all existing drop indicators
    document.querySelectorAll('#tabsList li.drop-indicator').forEach(item => {
      item.classList.remove('drop-indicator');
    });
    
    // Add drop indicator to the closest item
    if (closestItem) {
      closestItem.classList.add('drop-indicator');
    }
    
    return false;
  }

  function handleDragEnter(e) {
    e.preventDefault();
  }

  function handleDragLeave(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    
    const draggedTabId = parseInt(e.dataTransfer.getData('text/plain'));
    const dropIndicator = document.querySelector('#tabsList li.drop-indicator');
    
    if (dropIndicator) {
      const targetIndex = parseInt(dropIndicator.dataset.index);
      
      if (draggedTabId !== parseInt(dropIndicator.dataset.tabId)) {
        browserAPI.tabs.move(draggedTabId, { index: targetIndex })
          .then(() => {
            // Refresh the tab list after moving
            location.reload();
          })
          .catch(error => {
            console.error('Error moving tab:', error);
          });
      }
    }
  }

  function getClosestItem(items, y) {
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Add close tabs button functionality
  closeTabsButton.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('#tabsList input[type="checkbox"]:checked');
    const tabIds = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.tabId));
    
    if (tabIds.length > 0) {
      browserAPI.tabs.remove(tabIds)
        .then(() => {
          // Remove the closed tabs from the list
          checkboxes.forEach(checkbox => {
            checkbox.closest('li').remove();
          });
          // Hide the button after closing tabs
          closeTabsButton.style.display = 'none';
        })
        .catch(error => {
          console.error('Error closing tabs:', error);
        });
    }
  });
}); 
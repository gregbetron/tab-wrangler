document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({}, function(tabs) {
    const tabsList = document.getElementById('tabsList');
    tabs.forEach(tab => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      
      const leftContent = document.createElement('div');
      leftContent.style.display = 'flex';
      leftContent.style.alignItems = 'center';
      
      const img = document.createElement('img');
      img.src = tab.favIconUrl || '';
      img.alt = '';
      img.style.width = '16px';
      img.style.height = '16px';
      img.style.marginRight = '8px';
      leftContent.appendChild(img);
      leftContent.appendChild(document.createTextNode(tab.title));
      
      const rightContent = document.createElement('div');
      rightContent.style.display = 'flex';
      rightContent.style.alignItems = 'center';
      
      const trashIcon = document.createElement('img');
      trashIcon.src = 'icons/trash-solid.svg';
      trashIcon.alt = 'Close';
      trashIcon.style.width = '16px';
      trashIcon.style.height = '16px';
      trashIcon.style.marginRight = '8px';
      trashIcon.style.cursor = 'pointer';
      trashIcon.onclick = function() {
        chrome.tabs.remove(tab.id);
        li.remove();
      };
      rightContent.appendChild(trashIcon);
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      rightContent.appendChild(checkbox);
      
      li.appendChild(leftContent);
      li.appendChild(rightContent);
      tabsList.appendChild(li);
    });
  });
}); 
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({}, function(tabs) {
    const tabsList = document.getElementById('tabsList');
    tabs.forEach(tab => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = tab.favIconUrl || '';
      img.alt = '';
      img.style.width = '16px';
      img.style.height = '16px';
      img.style.verticalAlign = 'middle';
      img.style.marginRight = '8px';
      li.appendChild(img);
      li.appendChild(document.createTextNode(tab.title));
      tabsList.appendChild(li);
    });
  });
}); 
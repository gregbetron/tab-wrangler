document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({}, function(tabs) {
    const tabsList = document.getElementById('tabsList');
    tabs.forEach(tab => {
      const li = document.createElement('li');
      li.textContent = tab.title;
      tabsList.appendChild(li);
    });
  });
}); 
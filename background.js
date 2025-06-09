// Background script for Tab Wrangler
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Wrangler installed');
});

// Future: Add logic for tab data collection, classification, and prioritization 
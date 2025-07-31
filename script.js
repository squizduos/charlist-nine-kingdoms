// Tab functionality
function openTab(tabName) {
  // Hide all tab content
  const tabContents = document.getElementsByClassName('tab-content');
  for (let content of tabContents) {
    content.classList.remove('active');
  }
  
  // Remove active class from all tab buttons
  const tabButtons = document.getElementsByClassName('tab-button');
  for (let button of tabButtons) {
    button.classList.remove('active');
  }
  
  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');
  
  // Add active class to the clicked button
  event.target.classList.add('active');
}

// Dot functionality
document.addEventListener('DOMContentLoaded', function() {
  // Set initial values for dots
  setInitialDots();
  
  // Add click event listeners to all dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const dotsContainer = this.parentElement;
      const clickedValue = parseInt(this.getAttribute('data-value'));
      const maxValue = parseInt(dotsContainer.getAttribute('data-max'));
      
      // Update all dots in this container
      const allDots = dotsContainer.querySelectorAll('.dot');
      allDots.forEach((dot, index) => {
        const dotValue = index + 1;
        if (dotValue <= clickedValue) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    });
  });
});

function setInitialDots() {
  // Set initial filled dots based on the original HTML
  const dotsContainers = document.querySelectorAll('.dots');
  
  dotsContainers.forEach(container => {
    const dots = container.querySelectorAll('.dot');
    const maxValue = parseInt(container.getAttribute('data-max'));
    
    // Set initial values based on the original filled dots
    if (container.classList.contains('experience')) {
      // Experience: 2 filled
      setDotsValue(container, 2);
    } else if (container.classList.contains('health')) {
      // Health: 5 filled
      setDotsValue(container, 5);
    } else {
      // Default: set based on original filled dots
      const originalFilled = container.querySelectorAll('.filled').length;
      if (originalFilled > 0) {
        setDotsValue(container, originalFilled);
      }
    }
  });
}

function setDotsValue(container, value) {
  const dots = container.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    const dotValue = index + 1;
    if (dotValue <= value) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

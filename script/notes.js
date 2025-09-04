/* Chrome storage API is used to store data in the browser.
   By: Daniel */

//Track curent Categories
let selectedCategories = [];

// Check if we're in the popup/extension page context, then run all notes.html functionality (main function)
if (document.getElementById('content')) {
    // This is the popup page - handle save button
    const contentArea = document.getElementById('content');
    const titleArea = document.getElementById('title_input');
    const saveButton = document.getElementById('saveButton');
    const categoryButton = document.getElementById('categoryButton');

    loadCategories();

    // Category button event listener
    categoryButton.addEventListener('click', createCategory);

    // Save button handler for popup
    saveButton.addEventListener('click', () => {
        console.log("Save button clicked");
        const noteText = contentArea.value.trim();
        const titleText = titleArea.value.trim();
        if (noteText === '' || titleText === '') return;

        // Get the current URL before saving
        chrome.runtime.sendMessage({
            action: 'getURL'
        }, (response) => {
            console.log("Current URL:", response.url);
            
            // Save to chrome storage with URL included
            chrome.storage.local.get(['notes', 'categories'], (result) => {
                const notes = result.notes || [];
                const allCategories = result.categories || [];

                const selectedCategoryObjects = allCategories.filter(cat => selectedCategories.includes(cat.id));

                const new_note = {
                    // use a number representing the exact current time as id
                    id: Date.now(),
                    title: titleText,
                    content: noteText,
                    url: response.url || "Unknown URL", // Add URL to the note
                    timestamp: new Date().toISOString(), // Timestamp for users to see when the note was created
                    category: selectedCategoryObjects.map(cat => cat.name) // Store array of names
                 };
                
                notes.push(new_note);

                chrome.storage.local.set({
                    notes: notes,
                    currentNote: '' // Clear current note after saving
                }, () => {
                    console.log("Note saved with URL:", new_note);
                    contentArea.value = ''; // Clear textarea
                    titleArea.value = ''; // Clear titleArea

                    // clear selection
                    selectedCategories = [];
                    // also remove active class from all buttons
                    const allCategoryButtons = document.querySelectorAll('#category_buttons .category-btn');
                    allCategoryButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.style.backgroundColor = '';
                    });

                    // Send message to background script to update sidebar
                    chrome.runtime.sendMessage({
                        action: 'updateSidebar',
                        noteText: noteText
                    });
                });
            });
        });
    });

    // Auto-save current text as user types (optional)
    contentArea.addEventListener('input', () => {
        chrome.storage.local.set({ currentNote: { title: titleArea.value, content: contentArea.value } });
    });
}

// Creates a new Category button in categoryContainer in notes.html
function createCategory() {
    const categoryInput = document.getElementById('category_input');
    const categoryName = categoryInput.value;
    
    // Check if user entered empty name
    if (!categoryName || categoryName.trim() === '') {
        return;
    }

    const trimmedName = categoryName.trim();

    // Get existing categories from storage
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || [];
        
        // Check if category already exists
        const categoryExists = categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
        if (categoryExists) {
            console.log('Category already exists!');
            return;
        }

        // Create new category object
        const newCategory = {
            id: Date.now(),
            name: trimmedName
        };

        // Add to categories array
        categories.push(newCategory);

        // Save to storage
        chrome.storage.local.set({ categories: categories }, () => {
            console.log('Category saved:', newCategory);
            // Create and display the new category button
            createCategoryButton(newCategory);
            categoryInput.value = ''; // Clear input
        });
    });
}

// Function to create a category button element
function createCategoryButton(category) {
    const categoryContainer = document.getElementById('category_buttons');

    const newCategoryButton = document.createElement('button');
    newCategoryButton.textContent = category.name;
    newCategoryButton.className = 'category-btn';
    newCategoryButton.dataset.categoryId = category.id;
    
    // Add click event listener for category selection
    newCategoryButton.addEventListener('click', () => {
        selectCategory(category);
    });

    // Add right-click context menu for deletion 
    newCategoryButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm(`Delete category "${category.name}"?`)) {
            deleteCategory(category.id);
        }
    });

    categoryContainer.appendChild(newCategoryButton);
}

// Function to handle category selection
function selectCategory(category) {
    console.log('Toggling category:', category.name);
    
    const categoryContainer = document.getElementById('category_buttons');
    const button = categoryContainer.querySelector(`[data-category-id="${category.id}"]`);

    if (button) {
        const index = selectedCategories.indexOf(category.id);
        if (index > -1) {
            // Category is already selected, so unselect it
            button.classList.remove('active');
            button.style.backgroundColor = '';
            selectedCategories.splice(index, 1);
        } else {
            // Category is not selected, so select it
            button.classList.add('active');
            button.style.backgroundColor = 'cyan';
            selectedCategories.push(category.id);
        }
    }
    console.log('Selected category IDs:', selectedCategories);
}

// Function to delete a category
function deleteCategory(categoryId) {
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || [];
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        
        chrome.storage.local.set({ categories: updatedCategories }, () => {
            console.log('Category deleted:', categoryId);
            
            // If a selected category is deleted, remove it from the selected list
            const index = selectedCategories.indexOf(categoryId);
            if (index > -1) {
                selectedCategories.splice(index, 1);
            }
            
            // Remove the button from the DOM
            const categoryContainer = document.getElementById('category_buttons');
            
            if (categoryContainer) {
                const buttonToRemove = categoryContainer.querySelector(`button[data-category-id="${categoryId}"]`);

                if (buttonToRemove) {
                    buttonToRemove.remove();
                    console.log('Button removed from DOM:');
                }
                else{
                    console.log('Button not found in DOM for removal.');
                }
            }
        });
    });
}

// Function to load and display existing categories
function loadCategories() {
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || [];
                
        // Create buttons for each category
        categories.forEach(category => {
            createCategoryButton(category);
        });
    });
}
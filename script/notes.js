
/* Chrome storage API is used to store data in the browser.
   By: Daniel */

//Track curent Category
let currentCategory = '';

// Check if we're in the popup/extension page context, then run all notes.html functionality (main function)
if (document.getElementById('content')) {
    // This is the popup page - handle save button
    const contentArea = document.getElementById('content');
    const titleArea = document.getElementById('title_input');
    const saveButton = document.getElementById('saveButton');
    const categoryButton = document.getElementById('categoryButton');
    const highlightedTextElement = document.getElementById('highlightedText');

    // const deleteButton = document.getElementById('deleteButton');

    loadCategories();
    
    // Load existing note content when page loads
    chrome.storage.local.get(['currentNote'], (result) => {
        if (result.currentNote) {
            contentArea.value = result.currentNote.content;
            titleArea.value = result.currentNote.title;
        }
    });

    //Load highlighted text when page loads
    chrome.storage.local.get(['highlighted'], (result) =>{
        const highlighted = result.highlighted || '';
        
        //note.html is opened though highlighting text and right clicking
        if (highlighted){
            //Display highlighted text
            if (highlightedTextElement){
                highlightedTextElement.textContent = "Highlighted Text: " + highlighted;
            }

            //Clear highlighted text from storage after use
            chrome.storage.local.remove('highlighted');
        }
        //note.html is opened though sidebar or index.html
        else{
            if (highlightedTextElement){
                highlightedTextElement.textContent = ''
            }
        }
    })

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
            chrome.storage.local.get(['notes'], (result) => {
                const notes = result.notes || [];

                const new_note = {
                    // use a number representing the exact current time as id
                    id: Date.now(),
                    title: titleText,
                    content: noteText,
                    url: response.url || "Unknown URL", // Add URL to the note
                    timestamp: new Date().toISOString(), // Timestamp for users to see when the note was created
                    category: currentCategory ? currentCategory.name: ''                 
                 };
                
                notes.push(new_note);

                chrome.storage.local.set({
                    notes: notes,
                    currentNote: '' // Clear current note after saving
                }, () => {
                    console.log("Note saved with URL:", new_note);
                    contentArea.value = ''; // Clear textarea
                    titleArea.value = ''; // Clear titleArea

                    if (highlightedTextElement){
                        highlightedTextElement.textContent = '';
                    }
                    // Send message to background script to update sidebar
                    chrome.runtime.sendMessage({
                        action: 'updateSidebar',
                        noteText: noteText
                    });
                });
            });
        });
    });

    // Auto-save current text as user types
    contentArea.addEventListener('input', () => {
        chrome.storage.local.set({ currentNote: { title: titleArea.value, content: contentArea.value } });
    });

    titleArea.addEventListener('input', () => {
        chrome.storage.local.set({ 
            currentNote: { 
                title: titleArea.value, 
                content: contentArea.value 
            } 
        });
    });
}

// Creates a new Category button in categoryContainer in notes.html
function createCategory() {
    // Prompt user for category name
    const categoryName = prompt('Enter category name:');
    
    // Check if user cancelled or entered empty name
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
            alert('Category already exists!');
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
    console.log('Selected category:', category.name);
    
    currentCategory = category; // Update currentCategory variable

    const categoryContainer = document.getElementById('category_buttons');

    // Remove active class from all category buttons
    const allCategoryButtons = categoryContainer.querySelectorAll('.category-btn');
    allCategoryButtons.forEach(btn => btn.classList.remove('active'));
    allCategoryButtons.forEach(btn => btn.style.backgroundColor = ''); // Reset background color (can't be same line as above)

    
    // Add active class to selected button
    const selectedButton = categoryContainer.querySelector(`[data-category-id="${category.id}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
        selectedButton.style.backgroundColor = 'cyan'; // Change color to indicate selection
    }

    alert(`Selected category: ${category.name}`);
}

// Function to delete a category
function deleteCategory(categoryId) {
    chrome.storage.local.get(['categories'], (result) => {
        const categories = result.categories || [];
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        
        chrome.storage.local.set({ categories: updatedCategories }, () => {
            console.log('Category deleted:', categoryId);
            
            // If Selected Category is deleted, reset currentCategory
            if (currentCategory && currentCategory.id === categoryId) {
                currentCategory = '';
            }
            
            // Remove the button from the DOM
            const categoryContainer = document.getElementById('category_buttons');
            
            if (categoryContainer) {
                const buttonToRemove = categoryContainer.querySelector(`button[data-category-id="${categoryId}"]`);

                if (buttonToRemove) {
                    buttonToRemove.remove();
                    console.log('Button removed from DOM:');

                    alert('Selected category has been deleted.');

                    window.location.reload(); // Reload the page to reflect changes
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
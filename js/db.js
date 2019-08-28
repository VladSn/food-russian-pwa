// offline data
db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition'){
            // probably multiple tabs opend at once 
            console.log('persistence failed');
        } else if(err.code == 'unimplemented'){
            // lack of browser support
            console.log('persistence is not available');
        }
    })

// real-time listner 
db.collection('recipes').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
        //console.log(change, change.doc.data(), change.doc.id;
        if(change.type === 'added'){
            // add the document data to the DOM
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            // remove the document data from the DOM
            deleteRecipe(change.doc.id);
        }
    });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const recipes = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipes)
        .catch(err => console.log(err));
    
    form.title.value = '';
    form.ingredients.value = '';
});

// delete recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    if(evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
});
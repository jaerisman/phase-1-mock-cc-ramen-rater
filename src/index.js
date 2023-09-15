document.addEventListener('DOMContentLoaded', function() {
    let ramens;
    
    fetch('http://localhost:3000/ramens')
        .then(response => response.json())
        .then(data => {
            ramens = data;

            ramens.forEach((ramen, index) => {
                const img = document.createElement('img');
                img.src = ramen.image;
                img.setAttribute('data-index', index);

                const ramenImages = document.getElementById('ramen-menu');
                ramenImages.appendChild(img);
            });

            const images = document.querySelectorAll('#ramen-menu img');
            images.forEach((image, index) => {
                image.addEventListener('click', function() {
                    displayRamenDetails(index);
                });
            });

            displayRamenDetails(0);
        });
    function displayRamenDetails(index) {
        const selectedRamen = ramens[index];

    const ramenDetail = document.getElementById('ramen-detail');
    ramenDetail.innerHTML = '';

    const detailContainer = document.createElement('div');
    detailContainer.classList.add('detail-container');

    const detailImage = document.createElement('img');
    detailImage.classList.add('detail-image');
    detailImage.src = selectedRamen.image;
    detailImage.alt = selectedRamen.name;
    detailContainer.appendChild(detailImage);

    const nameElement = document.createElement('h2');
    nameElement.classList.add('name');
    nameElement.textContent = selectedRamen.name;
    detailContainer.appendChild(nameElement);

    const restaurantElement = document.createElement('h3');
    restaurantElement.classList.add('restaurant');
    restaurantElement.textContent = selectedRamen.restaurant;
    detailContainer.appendChild(restaurantElement);

    ramenDetail.appendChild(detailContainer);

    const ratingHeading = document.createElement('h3');
    ratingHeading.textContent = 'Rating:';
    ramenDetail.appendChild(ratingHeading);

    const ratingParagraph = document.createElement('p');
    const ratingSpan = document.createElement('span');
    ratingSpan.id = 'rating-display';
    ratingSpan.textContent = selectedRamen.rating;
    ratingParagraph.appendChild(ratingSpan);
    ratingParagraph.textContent += ' / 10';
    ramenDetail.appendChild(ratingParagraph);

    const commentHeading = document.createElement('h3');
    commentHeading.textContent = 'Comment:';
    ramenDetail.appendChild(commentHeading);

    const commentParagraph = document.createElement('p');
    commentParagraph.id = 'comment-display';
    commentParagraph.textContent = selectedRamen.comment;
    ramenDetail.appendChild(commentParagraph);
  }

  const ramenForm = document.getElementById('new-ramen')

  ramenForm.addEventListener('submit', function(event){
    event.preventDefault();

    const nameInput = document.getElementById('new-name');
    const restaurantInput = document.getElementById('new-restaurant');
    const imageInput = document.getElementById('new-image');
    const ratingInput = document.getElementById('new-rating');
    const commentInput = document.getElementById('new-comment');

    const newName = nameInput.value;
    const newRestaurant = restaurantInput.value;
    const newImage = imageInput.value;
    const newRating = ratingInput.value;
    const newComment = commentInput.value;

    const newRamen = {
        name: newName,
        restaurant: newRestaurant,
        image: newImage,
        rating: newRating,
        comment: newComment
    }

    fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRamen),
    })
    .then(response => response.json())
    .then(data => {
        const img = document.createElement('img');
        img.src = newRamen.image;
        
        const ramenImages = document.getElementById('ramen-menu');
        ramenImages.appendChild(img);

        ramens.push(newRamen);

        displayRamenDetails(ramens.length - 1);
        })
    .catch(error => {
        console.error('Error:', error);
    });
});

const editForm = document.getElementById('edit-ramen');

editForm.addEventListener('submit', function(event){
    event.preventDefault();

    const ratingInput = document.getElementById('new-rating');
    const commentInput = document.getElementById('new-comment');
    
    const updatedRating = ratingInput.value;
    const updatedComment = commentInput.value;

    const ramenIndex = editForm.getAttribute('data-index');
    const ramenToUpdate = ramens[ramenIndex];

    if (ramenToUpdate) {
        ramenToUpdate.rating = updatedRating;
        ramenToUpdate.comment = updatedComment;
    
        displayRamenDetails(ramenIndex);
    
        ratingInput.value = '';
        commentInput.value = '';
      } else {
        console.error('Error: Invalid ramen index');
      }
    
    const updatedRamen = {
        rating: updatedRating,
        comment: updatedComment
    };

    fetch(`http://localhost:3000/ramens/${ramenToUpdate.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(updatedRamen)
    })
    .then(response => {
        if(response.ok){
            console.log('Ramen Updated Successfully');
        } else {
            console.error('Error updating ramen');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
});
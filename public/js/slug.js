function deleteDream(slug){
  const body = `slug=${slug}`;
  console.log(slug);

  const promise = fetch('delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  }).then(response => response.json());
  promise.then(data => {
    if(data.error){
      console.log(data.error);
      return;
    } else {
      window.location.href = "../../profile";
    }
    });
}

function main() {
  const deleteBtn = document.querySelector('#delete-dream');
  deleteBtn.addEventListener("click", e => {
    deleteDream(deleteBtn.getAttribute("href"));
    e.preventDefault();
  });
}

document.addEventListener("DOMContentLoaded", main);

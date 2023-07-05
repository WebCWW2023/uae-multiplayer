const addPlayer = (formdata) => {
  const endpoint = "https://work.digimetaverse.live/add-player";
  var myHeaders = new Headers();

  fetch(endpoint, {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((data) => console.log("postData result : ", data))
    .catch((error) => console.error(error));
};
export { addPlayer };

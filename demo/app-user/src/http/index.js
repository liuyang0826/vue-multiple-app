const http = {
    post(url, data) {
        console.log(url, data);
        return fetch(url, {
            body: JSON.stringify(data),
            method: "POST",
        }).then(res => res.json())
    }
}

export default http
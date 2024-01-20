function includeHTML(url, targetId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(targetId).innerHTML = html;
        })
        .catch(error => console.error('Error fetching external HTML:', error));
}

// Call the function with the URL of the external HTML file and the target container ID
includeHTML('../view/header.html', 'externalContent');function includeHTML(url, targetId) {
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    document.getElementById(targetId).innerHTML = html;
                })
                .catch(error => console.error('Error fetching external HTML:', error));
        }

        // Call the function with the URL of the external HTML file and the target container ID
        includeHTML('../view/header.html', 'externalContent');


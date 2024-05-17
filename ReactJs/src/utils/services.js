export const baseUrl = "http://localhost:3000/api";

export const postRequest = async (url, body) => {
     console.log("body", body);
    const response = await fetch(url, {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Make sure to stringify the body
    });

    const data = await response.json();

    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }

        return { error: true, message };
    }

    return data;
};


export const getRequest = async (url) => {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
        let message = "An error occurred...";

        if (data?.message) {
            message = data.message;
        }

        return { error: true, message };
    }

    return data;
};

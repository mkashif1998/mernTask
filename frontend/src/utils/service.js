const API_URL = 'http://localhost:5000';

export const getRequest = async (url) => {
    const response = await fetch(`${API_URL}/${url}`);
    return response.json();
};

export const postRequest = async (url, data) => {
    const response = await fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }); 
    return response.json();
};

export const putRequest = async (url, data) => {
    const response = await fetch(`${API_URL}/${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteRequest = async (url) => {
    const response = await fetch(`${API_URL}/${url}`, {
        method: 'DELETE'
    });
    return response.json();
};


export const apiPatchRequest = async (request) => {
    let headers = {
        "accept": "*/*",
        "content-type": request.content_type,
    };

    let headersClone = { ...headers };

    const response = await fetch(request.apiUrl, {
        method: "PATCH",
        headers: headersClone,
        body: JSON.stringify(request.data),
    });

    return apiResponseHandler(response);
};

const apiResponseHandler = async (res) => {
    if (!res.ok) {
        const error = await res.json().catch(() => res.status);
        return Promise.reject(error);
    } else {
        return res.json();
    }
};

var Base = (function(){
    var constant = {
        METHOD_GET : 'GET',
        METHOD_POST : 'POST',
        METHOD_DELETE : 'DELETE',
        METHOD_PUT : 'PUT',
    };
    function sendApi({url,method=constant.METHOD_GET,data,onDone=function(){},onSuccess,onFailed}){
        switch (constant){
            case METHOD_GET:{
                axios
                    .get(url, {
                        headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        onFailed(error);
                    })
                    .finally(function (event) {
                        onDone();
                    });
                break;
            }
            case METHOD_POST:{
                axios
                    .post(url, data, {
                        headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        onFailed(error);
                    })
                    .finally(function (event) {
                        
                        onDone();
                    });
                break;
            }
            case METHOD_DELETE:{
                axios
                    .delete(url, {
                        headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        onFailed(error);
                    })
                    .finally(function (event) {
                        
                        onDone();
                    });
                break;
            }
            case METHOD_PUT:{
                axios
                    .put(url,data, {
                        headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    })
                    .then((response) => {
                        onSuccess(response.data)
                    })
                    .catch((error) => {
                        onFailed(error);
                    })
                    .finally(function (event) {
                        
                        onDone();
                    });
                break;
            }
        }
    }
    return {
        sendApi:sendApi,
        constant:constant
    }
})();

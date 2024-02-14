export class APIContext {
    static LoginMethod(body){
        return fetch(`http://127.0.0.1:8000/auth/login/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(body)
        }).then(resp => resp.json())
    }

    static RegisterNewUser(body_){
        return fetch(`http://127.0.0.1:8000/auth/user/create/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                'group_name' : body_['group_name'],
                'username': body_['username'],
                'password': body_['password1'],
            })
        }).then(resp => resp.json())
    }
}

export default APIContext
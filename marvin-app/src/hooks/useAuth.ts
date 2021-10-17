const TTL = 1000 * 60 * 60 * 24; // 1 day 
const key = 'userId';

const getStorage = () => localStorage;

const isAuth = () => {
    const storage = getStorage();

    const rawUserData = storage.getItem(key);

    if(rawUserData) {
        const userData = JSON.parse(rawUserData);

        const now = new Date();

        if (now.getTime() < userData.expiry) {
            return true
        }
    }

    return false
}

const getAuth = () => {
    const storage = getStorage();
    return storage.getItem(key)
}

const setAuth = (userId: number) => {
    const storage = getStorage();

    if(!isAuth()) {
        localStorage.setItem(key, JSON.stringify({
            userId,
            expiry: new Date().getTime() + TTL
        }))
    } 
}

export {
    isAuth,
    getAuth,
    setAuth
}
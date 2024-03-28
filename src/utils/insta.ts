import axios from "axios";

export default async function InstaTracker(username: string) {
    const { data } = await axios({
        method: "GET",
        url: `https://www.instagram.com/web/search/topsearch/?query=${username}`,
        headers: {
            "Cookie": 'YOUR COOKIES INSTAGRAM',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        }
    }) 

    return data;
}

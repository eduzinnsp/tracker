import axios from "axios";

export default async function InstaTracker(username: string) {
    const { data } = await axios({
        method: "GET",
        url: `https://www.instagram.com/web/search/topsearch/?query=${username}`,
        headers: {
            "Cookie": 'dpr=1.5; mid=ZfKF3gALAAEyP7n0YNxdqbWVBTxI; ig_did=06B98FA0-EAE0-4A94-8F27"Cookie": "dpr=1.5; mid=ZfKF3gALAAEyP7n0YNxdqbWVBTxI; ig_did=06B98FA0-EAE0-4A94-8F27-4BCF5F0BFA61; ps_l=0; ps_n=0; datr=3YXyZQB3CkUOOTTmbnChfkgu; ig_nrcb=1; ds_user_id=55627802003; csrftoken=qtlMRfIcFDL2tGy92P7r4ZKy6k8X2hMO; sessionid=55627802003%3AGYS16pgQdl62DV%3A16%3AAYckh7wz-Qb4PJrD67HMa7C9dKiyEbHEkGQhV9n54w; shbid="14655\\05455627802003\\0541741928870:01f7f80614ff3e9b6739733554a8f2264a318a3e442336205747bfddc89787cc102cce9d"; shbts="1710392870\\05455627802003\\0541741928870:01f7dc2db47bc130829e403d28f7d245be6ff9f102de64bb3e69e433d5ba484dfab8ba03"; rur="NCG\\05455627802003\\0541741931941:01f74d708f6f08ae6ff1c572e210d1d3d6c883f54fb6f5bd9d65ea1f5c34fe867e598447"-4BCF5F0BFA61; ps_l=0; ps_n=0; datr=3YXyZQB3CkUOOTTmbnChfkgu; ig_nrcb=1; ds_user_id=55627802003; csrftoken=qtlMRfIcFDL2tGy92P7r4ZKy6k8X2hMO; sessionid=55627802003%3AGYS16pgQdl62DV%3A16%3AAYckh7wz-Qb4PJrD67HMa7C9dKiyEbHEkGQhV9n54w; shbid="14655\\05455627802003\\0541741928870:01f7f80614ff3e9b6739733554a8f2264a318a3e442336205747bfddc89787cc102cce9d"; shbts="1710392870\\05455627802003\\0541741928870:01f7dc2db47bc130829e403d28f7d245be6ff9f102de64bb3e69e433d5ba484dfab8ba03"; rur="NCG\\05455627802003\\0541741931941:01f74d708f6f08ae6ff1c572e210d1d3d6c883f54fb6f5bd9d65ea1f5c34fe867e598447"',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        }
    }) 

    return data;
}
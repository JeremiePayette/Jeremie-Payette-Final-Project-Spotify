import { useEffect, useState } from "react";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

useEffect(() => {
        const getUserProfile = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });
            const data = await response.json();
            const displayName = data.display_name.replace(/\s+/g, '');
            localStorage.setItem("displayName", displayName);
            setUserProfile(data);
        } catch (error) {
            console.error(error);
        }
        };

        if (accessToken) {
        getUserProfile();
        }
    }, [accessToken]);

    return <div>{userProfile ? userProfile.display_name : "Loading..."}</div>;
    };

export default UserProfile;
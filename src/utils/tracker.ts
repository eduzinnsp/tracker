import { Client, VoiceState } from "discord.js-selfbot-v13";
import { Logs } from "./logs";

import axios from "axios";
import { JsonDatabase } from "wio.db";

const client = new Client();
const logs = new Logs();
const db = new JsonDatabase({ databasePath: "./database.json" });

client.login(process.env.token);
client.on("ready", () => {
    logs.success(`Client Online: ${client.user?.username}`);
});

client.on("userUpdate", async (oldUser, newUser) => {
    const findUser = await db.get(newUser.id);
    const { data: userProfile } = await axios.get(`https://discord.com/api/v9/users/${newUser.id}/profile?with_mutual_guilds=true&with_mutual_friends_count=true`, { headers: { "Authorization": client.token } })
    
    if (!findUser) { 
        let options = {
            avatar: userProfile.user.avatar == null ? "No have avatar" : userProfile.user.avatar,
            bio: userProfile.bio == null ? "No have bio" : userProfile.bio,
            banner: userProfile.banner == null ? "No have banner" : userProfile.banner,
            themes: userProfile.premium_type == null ? [] : userProfile.theme_colors,
            profile_effect: userProfile.user_profile.profile_effect == null? "No have profile effect" : userProfile.user_profile.profile_effect,
            pronouns: userProfile.user_profile == null ? "No have pronous" : userProfile.user.pronouns,
            global_name: userProfile.user.global_name == null ? "No have global name" : userProfile.user.global_name,
            legacy_username: userProfile.legacy_username == null ? "No have legacy username" : userProfile.legacy_username,
            premium_since: userProfile.premium_since == null ? "No have premium since" : userProfile.premium_since,
            premium_type: userProfile.premium_type == null ? "No have premium type" : userProfile.premium_type,
            guild_since: userProfile.premium_guild_since == null ? "No have guild since" : userProfile.premium_guild_since
        }

        await db.set(`${oldUser.id}`, oldUser.id);
        await db.set(`${oldUser.id}.profile`, { id: oldUser.id, username: newUser.username, global_name: options.global_name, legacy_username: options.legacy_username, pronouns: options.pronouns, avatar: options.avatar });
        await db.set(`${oldUser.id}.extrasProfile`, { bio: options.bio, banner: options.banner, theme_colors: options.themes, profile_effect: options.profile_effect });
        await db.set(`${oldUser.id}.nitro`, { premium_since: options.premium_since, premium_type: options.premium_type, premium_guild_since: options.guild_since, booster: userProfile.badges.filter((bad: any) => (["guild_booster"].includes(bad.id))).map((bad: any) => ({ name: bad.id.split("-")[2], description: bad.description, icon: bad.icon })) });
        await db.set(`${oldUser.id}.badges`, userProfile.badges.map((badge: any) => ({ id: badge.id, description: badge.description })));
        await db.set(`${oldUser.id}.connections`, userProfile.connected_accounts.map((connection: any) => ({ type: connection.type, name: connection.name, verified: connection.verified })));
        await db.set(`${oldUser.id}.tracker`, { lastCall: "No have last call.", lastMessage: "No have last message.", lastTimeCall: 0, lastTimeMessage: 0, usernameHistory: [], globalNamesHistory: [], callHistory: [], avatarHistory: [], messagesHistory: [], biosHistory: [], lastActions: [] });
    } 

    if (oldUser.username !== newUser.username) {
        await db.set(`${oldUser.id}.profile.username`, newUser.username);
        await db.push(`${oldUser.id}.tracker.usernamesHistory`, newUser.username);
        await db.push(`${oldUser.id}.tracker.lastAction`, { action: "updateUsername", oldUsername: oldUser.username, newUsername: newUser.username, date: Date.now() });
    }

    if (oldUser.globalName !== newUser.globalName) {
        await db.set(`${oldUser.id}.profile.global_name`, oldUser.globalName !== null ? newUser.globalName : "GlobalName removeded");
        await db.push(`${oldUser.id}.tracker.globalNamesHistory`, newUser.globalName);
        await db.push(`${oldUser.id}.tracker.lastAction`, { action: "updateGlobalName", oldGlobalName: oldUser.globalName !== null ? newUser.globalName : oldUser.globalName, newGlobalName: newUser.globalName !== null ? newUser.globalName : "GlobalName removeded", date: Date.now() });
    }

    if (oldUser.avatar !== newUser.avatar) {
        await db.set(`${oldUser.id}.profile.avatar`, oldUser.avatar !== null ? newUser.avatar : "Avatar removeded");
        await db.push(`${oldUser.id}.tracker.avatarHistory`, oldUser.avatar !== null ? oldUser.avatarURL() : "Avatar removeded");
        await db.push(`${oldUser.id}.tracker.lastAction`, { action: "updateAvatar", oldAvatar: oldUser.avatar !== null ? oldUser.avatarURL() : newUser.avatar, newAvtar: newUser.avatar !== null ? newUser.avatar : "Avatar removeded", date: Date.now() });
    }

    if (oldUser.avatarDecoration !== newUser.avatarDecoration) {
        await db.push(`${oldUser.id}.tracker.lastAction`, { action: "updateAvatarDecoration", oldAvatarDecoration: oldUser.avatarDecoration !== null ? oldUser.avatarDecoration : newUser.avatarDecoration, newAvatarDecoration: newUser.avatarDecoration !== null ? newUser.avatarDecoration : "Avatar Decoration removeded", date: Date.now() });
    }
});

client.on("voiceStateUpdate", async (oldVoice: VoiceState, newVoice: VoiceState) => {
    let findUser = await db.get(newVoice.member?.id as string);
    if (!findUser) return;

    let oldVoiceId = oldVoice.channelId;
	let newVoiceId = newVoice.channelId;

    let oldChannelName = (oldVoiceId != null && typeof oldVoiceId != undefined) ? oldVoice.guild.channels.cache.get(oldVoiceId as string)?.name : null;
	let newChannelName = (newVoiceId != null && typeof newVoiceId != undefined) ? newVoice.guild.channels.cache.get(newVoiceId as string)?.name : null;
	
    if (oldChannelName === null) {
        await db.push(`${oldVoice.member?.id}.tracker.lastAction`, { action: "joinChannelVoice", channels: { oldChannel: "No have old channel.", newChannel: newVoice.channel?.id }, guild: { name: newVoice.guild.name, id: newVoice.guild.id }, members: "" });
        await db.push(`${oldVoice.member?.id}.tracker.callHistory`, { action: "joinChannelVoice", channels: { oldChannel: "No have old channel.", newChannel: newVoice.channel?.id }, guild: { name: newVoice.guild.name, id: newVoice.guild.id }, members: "" });
    } else if (newChannelName === null) {
        await db.push(`${oldVoice.member?.id}.tracker.lastAction`, { action: "leaveChannelVoice", channels: { oldChannel: oldVoice.channel?.id, newChannel: "No have new channel." }, guild: { name: oldVoice.guild.name, id: oldVoice.guild.id }, members: "" });
        await db.push(`${oldVoice.member?.id}.tracker.callHistory`, { action: "leaveChannelVoice", channels: { oldChannel: oldVoice.channel?.id, newChannel: "No have new channel." }, guild: { name: oldVoice.guild.name, id: oldVoice.guild.id }, members: "" });
    } else {
        await db.push(`${oldVoice.member?.id}.tracker.lastAction`, { action: "movedChannelVoice", channels: { oldChannel: oldVoice.channel?.id, newChannel: newVoice.channel?.id }, guild: { name: oldVoice.guild.name, id: oldVoice.guild.id }, members: "" });
        await db.push(`${oldVoice.member?.id}.tracker.callHistory`, { action: "movedChannelVoice", channels: { oldChannel: oldVoice.channel?.id, newChannel: newVoice.channel?.id }, guild: { name: oldVoice.guild.name, id: oldVoice.guild.id }, members: "" });
    }
});
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import CacheImage from './CacheImage';

const ChannelList = ({
	listData,
	channelType,
	navigation,
	currentUser,
	handleEditChannel,
	channelSearch,
	PMs,
	showLists,
}) => {
	let color = '#808080';
	if (channelType === 'private') color = '#301934';
	if (channelType === 'pm') color = '#036';
	let size = 0;
	if (showLists.public && showLists.private) {
		size = 0.5;
	} else if (showLists[channelType]) {
		size = 0.9;
	}
	return (
		<Animated.View style={{ width: Dimensions.get('window').width * showLists[channelType + 'Width'] }}>
			<FlatList
				style={{ marginTop: 0, height: 275 }}
				data={listData}
				keyExtractor={item => item._id}
				renderItem={({ item }) => {
					if (
						(item.name && item.name.includes(channelSearch)) ||
						(item.username && item.username.includes(channelSearch))
					) {
						let Pm_id;
						if (item.username) {
							let thisPM = PMs.find(pm => pm.members.includes(item.username));
							Pm_id = thisPM._id;
						}
						return (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Room', {
										roomName: item.name ? item.name : item.username,
										username: currentUser.username,
										friend: item.username ? item : null,
										// room_id: item.name ? item._id : [item.username, currentUser.username],
										room_id: item.name ? item._id : Pm_id,
										roomCreator: item.creator,
										roomType: item.username ? 'pm' : channelType,
									})
								}
								onLongPress={item.name ? () => handleEditChannel(`edit_${channelType}`, item) : null}
							>
								<ListItem
									containerStyle={styles.channel(item.username ? '#036' : color)}
									chevron
									title={item.name ? item.name : item.username}
									titleStyle={styles.title}
									leftAvatar={
										item.avatar ? (
											<View>
												<CacheImage uri={item.avatar} style={styles.avatarStyle} />
											</View>
										) : (
											<Entypo name="users" size={40} color="#0af" />
										)
									}
								/>
							</TouchableOpacity>
						);
					}
				}}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	channel: color => ({
		height: 60,
		backgroundColor: color,
		margin: 5,
		borderRadius: 10,
	}),
	title: {
		color: 'white',
	},
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
});

export default ChannelList;

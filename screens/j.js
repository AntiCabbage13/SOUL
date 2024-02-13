import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator();
const Navigation = () => {
    const { currentUser } = useSendbirdChat();

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {!currentUser ? (
                    <RootStack.Screen name={'SignIn'} component={SignInScreen} />
                ) : (
                    <>
                        <RootStack.Screen name={'GroupChannelList'} component={GroupChannelListScreen} />
                        <RootStack.Screen name={'GroupChannelCreate'} component={GroupChannelCreateScreen} />
                        <RootStack.Screen name={'GroupChannel'} component={GroupChannelScreen} />
                    </>
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <SendbirdUIKitContainer
            appId={'APP_ID'}
            chatOptions={{ localCacheStorage: AsyncStorage }}
            platformServices={{
                file: FileService,
                notification: NotificationService,
                clipboard: ClipboardService,
                media: MediaService,
            }}
        >
            <Navigation />
        </SendbirdUIKitContainer>
    );
};
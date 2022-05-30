import React, {Suspense} from 'react';
import { FlatList, StyleSheet, Text, View, Image, Animated } from 'react-native';
import { connect } from 'react-redux'
import { updateScrollValue, updateAppList, updatePage } from '../Actions/appList';
import * as Progress from 'react-native-progress';
import { Rating } from 'react-native-elements'
import { debounce, throttle } from "lodash";

class AppList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.scrollY = new Animated.Value(0);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.filteredAppList !== this.props.filteredAppList) {
            this.setState({
                loading: false
            })
        }
    }

    debounceEventHandler(...args) {
        const debounced = debounce(...args)
        return (e) => {
            throttle(() => {
                 this.props.updateScrollValue(e.nativeEvent.contentOffset.y / 1210)
            }, 20)()
            e.persist()
            return debounced(e)
        }
    }

    onScrollHandler = (event) => {
        let offset = event.nativeEvent.contentOffset.y
        let contentHeight = event.nativeEvent.contentSize.height
        let viewHeight = event.nativeEvent.layoutMeasurement.height
        if (this.props.keyword == "" && (offset + viewHeight) / contentHeight > 0.7 && this.props.page <= 10){
            //console.log("Lazy load checking: ", (offset + viewHeight) / contentHeight ,(offset + viewHeight) / contentHeight > 0.7)
            this.setState({
                loading: true
            })
            this.props.updatePage(this.props.page + 1)
        }
    }

    render() {
        return (
            <View>
                <Progress.Circle size={20} indeterminate={true} style={[styles.loadingProgressStyle, (this.state.loading?{display: 'flex'}:{display: 'none'})]}/>
                <Animated.FlatList
                    data={this.props.filteredAppList}
                    extraData={this.props.filteredAppList}
                    bounces={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: {contentOffset: {y:this.scrollY}}}], { useNativeDriver: true, listener: this.debounceEventHandler(this.onScrollHandler, 50)})}//{this.debounceEventHandler(this.onScrollHandler, 250)}
                    renderItem={({item, index}) => {

                        const scaleInputRange = [
                            -1,
                            0,
                            120 * index,
                            120 * (index + 2)
                        ]

                        const scale = this.scrollY.interpolate({
                            inputRange: scaleInputRange,
                            outputRange: [1,1,1,0],
                            extrapolate: 'clamp'
                        })

                        const opacityInputRange = [
                            -1,
                            0,
                            120 * index,
                            120 * (index + 1)
                        ]

                        const opacity = this.scrollY.interpolate({
                            inputRange: opacityInputRange,
                            outputRange: [1,1,1,0],
                            extrapolate: 'clamp'
                        })
                        
                        return <Animated.View style={[styles.listItemContaniner, {transform: [{scale}], opacity: opacity}]}>
                            <View style={styles.listItemCountContainer}>
                                <Text style={styles.listItemCount}>{index + 1}</Text>
                            </View>
                            <Suspense fallback={<Progress.Circle size={80} indeterminate={true} />}>
                            <Image
                                style={((index + 1) % 2 == 1)?styles.listItemIcon:styles.listItemIconEven}
                                source={
                                    {uri: item.appIcon}
                                }
                            />
                            </Suspense>
                            <View style={styles.listItemInfoContainer}>
                                <Text style={styles.listItemText} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.listItemCat}>{item.category}</Text>
                                <View style={styles.listItemRating}>
                                    <Rating imageSize={12} type="custom" ratingColor="#fd9400" readonly fractions="{1}" startingValue={item.rating} />
                                    <Text style={styles.listItemRatingCount}>({item.ratingCount})</Text>
                                </View>
                            </View>
                        </Animated.View>
                    }}
                />
            </View>
        );
    }
}

const mapStateToProps = store => (
    { filteredAppList: store.filteredAppList, page: store.page, keyword: store.keyword }
)

export default connect(mapStateToProps, {updateAppList, updateScrollValue, updatePage})(AppList)

const styles = StyleSheet.create({
    loadingProgressStyle: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    appListContainer: {
        flexGrow: 1,
    },
    listItemContaniner: {
        marginLeft: 15,
        marginRight: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
        backgroundColor: 'white',
        minHeight: 120
    },
    listItemCountContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    listItemCount: {
        fontSize: 25,
        color: '#8f8f8f'
    },
    listItemIcon: {
        borderRadius: 20,
        width: 90,
        height: 90,
        borderWidth: 1,
        borderColor: '#aaa',
        marginRight: 15
    },
    listItemIconEven: {
        borderRadius: 45,
        width: 90,
        height: 90,
        borderWidth: 1,
        borderColor: '#aaa',
        marginRight: 15,
    },
    listItemInfoContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5,
        height: 90,
    },
    listItemText: {
        fontSize: 16,
    },
    listItemCat: {
        fontSize: 14,
        color: '#6e6e6e'
    },
    listItemRating: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemRatingCount: {
        marginLeft: 5,
        color: '#787878',
        fontSize: 12
    }
});
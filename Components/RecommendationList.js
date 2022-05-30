import React, {Suspense, createRef} from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress';
import * as ScreenOrientation from 'expo-screen-orientation'
import { debounce, throttle } from "lodash";

class RecommendationList extends React.Component {

    constructor(props) {
        super(props);
        this.listRef = createRef()
        this.state = {
            screenWidth: 0,
            contentWidth: 0,
            offsetX: 0,
            orientation: 1
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentScrollValue !== this.props.currentScrollValue) {
            // this.listRef.current.scrollToOffset({animated: false, offset: this.props.currentScrollValue * this.state.contentWidth})
            setTimeout(() => {
                if (prevProps.currentScrollValue < this.props.currentScrollValue){
                    //console.log(this.state.offsetX - (this.props.currentScrollValue - prevProps.currentScrollValue) * this.state.contentWidth, this.props.currentScrollValue, this.state.offsetX);
                    this.listRef.current.scrollToOffset({animated: false, offset: this.state.offsetX + (this.props.currentScrollValue - prevProps.currentScrollValue) * this.state.contentWidth})
                }else{
                    //console.log(this.state.offsetX - (prevProps.currentScrollValue - this.props.currentScrollValue) * this.state.contentWidth, this.props.currentScrollValue, this.state.offsetX);
                    this.listRef.current.scrollToOffset({animated: false, offset: this.state.offsetX - (prevProps.currentScrollValue - this.props.currentScrollValue) * this.state.contentWidth})
                }
            }, 10)
        }
    }

    onOrientationChange = async (orientation) => {
        this.setState({ orientation: orientation.orientationInfo.orientation });
    };
    
    componentDidMount() {
        ScreenOrientation.getOrientationAsync().then((orientation) => {
            this.setState({
              orientation: orientation
            })
          })
        this.subscription = ScreenOrientation.addOrientationChangeListener(this.onOrientationChange);
    }

    componentWillUnmount(){
        ScreenOrientation.removeOrientationChangeListener(this.subscription)
    }

    render() {
        return (
            <View style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.recommendationListContainer:landstyles.recommendationListContainer}>
              <FlatList
                ref={this.listRef}
                data={this.props.filteredRecommendAppList}
                extraData={this.props.filteredRecommendAppList}
                onLayout = {(event) => {this.setState({screenWidth: event.nativeEvent.layout.width})}}
                onContentSizeChange= {(contentWidth) => {this.setState({contentWidth: contentWidth})}}
                onScroll = {(event) => {this.setState({offsetX: event.nativeEvent.contentOffset.x})}}
                scrollEventThrottle = {16}
                renderItem={({item, index}) => (
                    <View style={[(this.state.orientation == 1 || this.state.orientation == 2)?styles.listItemContaniner:landstyles.listItemContaniner, (index == 0)?{paddingLeft: 10}:""]}>
                        <Suspense fallback={<Progress.Circle size={80} indeterminate={true} />}>
                        <Image
                            style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.listItemIcon:landstyles.listItemIcon}
                            source={
                                {uri: item.appIcon}
                            }
                        />
                        </Suspense>
                        <Text style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.listItemText:landstyles.listItemText} numberOfLines={2}>{item.name}</Text>
                        <Text style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.listItemCat:landstyles.listItemCat}>{item.category}</Text>
                    </View>
                )}
                horizontal={true}
              />
            </View>
          );
    }
}

const mapStateToProps = store => (
    { filteredRecommendAppList: store.filteredRecommendAppList, currentScrollValue: store.currentScrollValue }
)

export default connect(mapStateToProps, null)(RecommendationList)

const styles = StyleSheet.create({
    recommendationListContainer: {
        paddingTop: 20
    },
    listItemContaniner: {
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 30,
    },
    paddingRight: 20,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 30,
    listItemIcon: {
        borderRadius: 20,
        width: 100,
        height: 100,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#aaa',
    },
    listItemText: {
        fontSize: 16,
        maxWidth: 100,
        marginBottom: 10,
    },
    listItemCat: {
        fontSize: 14,
        color: '#6e6e6e'
    },
});

const landstyles = StyleSheet.create({
    recommendationListContainer: {
        paddingTop: 10
    },
    listItemContaniner:{
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 10,
    },
    listItemIcon:{
        borderRadius: 20,
        width: 75,
        height: 75,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#aaa',
    },
    listItemText:{
        fontSize: 14,
        maxWidth: 75,
        marginBottom: 10,
    },
    listItemCat: {
        fontSize: 12,
        color: '#6e6e6e'
    },
})
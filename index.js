import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import RecommendationList from './Components/RecommendationList';
import AppList from './Components/AppList';
import ApplicationController from './Controller/ApplicationController';
import { connect } from 'react-redux'
import { updateRecommendAppList, updateAppList, searchApp } from './Actions/appList';
import * as ScreenOrientation from 'expo-screen-orientation'

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orientation: 1,
    }
  }

  onOrientationChange = async (orientation) => {
    console.log('orientation changed');
    console.log(orientation.orientationInfo.orientation)
    this.setState({ orientation: orientation.orientationInfo.orientation });
  };

  componentDidMount() {
    console.log("in")
    Promise.all([ApplicationController.getRecommendedAppData(), ApplicationController.getAppList()]).then((ret) => {
      this.props.updateRecommendAppList(ret[0]);
      this.props.updateAppList(ret[1]);
      this.setState(() => {
        loading = false
      })
    }, (err) => {
      console.log(err)
      let toast = Toast.show('Please double check your internet connection.', {
        duration: Toast.durations.LONG,
      });
    })
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
  

  render (){
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.progressContainer, (!this.state.loading)?{display: 'flex'}:{display: 'none'}]}>
          <Progress.Circle size={80} indeterminate={true} />
        </View>
        <View style={[styles.container, (this.state.loading)?{display: 'flex'}:{display: 'none'}]}>
          <SearchBar
            containerStyle={styles.searchContainer}
            inputContainerStyle={(this.state.orientation == 1 || this.state.orientation == 2)?styles.searchBarStyle:landstyles.searchBarStyle}
            leftIconContainerStyle={[(this.state.orientation == 1 || this.state.orientation == 2)?styles.searchIconStyle:landstyles.searchIconStyle, this.props.keyword != ""?styles.searchIconDisplayNone:styles.searchIconDisplayFlex]}
            autoCorrect={false}
            placeholder="搜尋"
            value={this.props.keyword}
            round
            inputStyle={{textAlign:'center'}}
            onChangeText={(keyword) => this.props.searchApp(keyword)}
          />
          <View style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.recommendationContainer:landstyles.recommendationContainer}>
            <Text style={(this.state.orientation == 1 || this.state.orientation == 2)?styles.recommendationHeading:landstyles.recommendationHeading}>推介</Text>
            <RecommendationList/>
          </View>
          <View style={styles.appListContainer}>
            <AppList/>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = store => (
  { recommendAppList: store.recommendAppList, appList: store.appList, keyword: store.keyword }
)

export default connect(mapStateToProps, {updateRecommendAppList, updateAppList, searchApp})(App)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer:{
    flexDirection:'row',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderTopWidth: 0,
    borderBottomColor: '#dfdfdf'
  },
  searchBarStyle:{
    backgroundColor: '#e4e5e6',
  },
  searchIconStyle:{
    position:'absolute',
    left:'35%'
  },
  searchIconDisplayFlex:{
    display: 'flex'
  },
  searchIconDisplayNone:{
    display: 'none'
  },
  recommendationContainer:{
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
  },
  recommendationHeading:{
    fontSize: 25,
    paddingLeft: 10,
  },
  appListContainer:{
    flex: 1
  }
});

const landstyles = StyleSheet.create({
  searchBarStyle:{
    height: 25,
    backgroundColor: '#e4e5e6',
  },
  searchIconStyle:{
    position: 'absolute',
    left: '42%',
  },
  recommendationContainer:{
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
  },
  recommendationHeading:{
    fontSize: 20,
    paddingLeft: 10,
  },
});

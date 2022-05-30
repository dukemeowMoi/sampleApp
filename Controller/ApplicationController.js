import ApplicationModel from '../Model/ApplicationModel';

export default class ApplicationController{

    static getRecommendedAppData = async () => {
        let response = await fetch("https://itunes.apple.com/hk/rss/topgrossingapplications/limit=10/json", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        let recommendList = [];

        recommendList = await Promise.all(json['feed']['entry'].map(async jsonObj => {
            let applicationModel = await ApplicationModel.extractAndFormModel(jsonObj);
            //console.log("Model: ", applicationModel);
            return applicationModel.toSerializable();
        }));

        return recommendList;
    }

    static getAppList = async () => {
        let response = await fetch("https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json = await response.json();
        let appList = [];
        //let newJsonAry = json['feed']['entry'].splice((page - 1) * 10, 10)
        appList = await Promise.all(json['feed']['entry'].map(async jsonObj => {
            let applicationModel = await ApplicationModel.extractAndFormModel(jsonObj);
            return applicationModel.toSerializable()
        }))
        return appList;
    }
}
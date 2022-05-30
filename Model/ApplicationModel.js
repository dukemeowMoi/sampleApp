class ApplicationModel {
    name;
    appIcon;
    category;
    rating;
    ratingCount;
    author;
    summary;

    constructor(name, appIcon, category, rating, ratingCount, author, summary){
        this.name = name
        this.appIcon = appIcon
        this.category = category
        this.rating = rating
        this.ratingCount = ratingCount
        this.author = author
        this.summary = summary
    }

    static extractAndFormModel = async (jsonObj) => {
        let appName = jsonObj['im:name']['label'];
        let appIcon = jsonObj['im:image'][2]['label'];
        let category = jsonObj['category']['attributes']['label']
        let summary = jsonObj['summary']['label']

        let appId = jsonObj['id']['attributes']['im:id']

        let detailResponse = await fetch("https://itunes.apple.com/hk/lookup?id="+appId, {
            method: 'GET'
        });
        let detailJSON = await detailResponse.json()
        let rating = detailJSON['results'][0]['averageUserRating']
        let ratingCount = detailJSON['results'][0]['userRatingCount']
        let author = detailJSON['results'][0]['artistName']

        let applicationModel = new ApplicationModel(appName, appIcon, category, rating, ratingCount, author, summary);
        return applicationModel;
    }

    toSerializable() {
        return {
            name: this.name, 
            appIcon: this.appIcon, 
            category: this.category, 
            rating: this.rating, 
            ratingCount: this.ratingCount, 
            author: this.author,
            summary: this.summary
        }
    }

    static fromSerializable(serializedModel) {
        let applicationModel = new ApplicationModel(
            serializedModel.name, 
            serializedModel.appIcon, 
            serializedModel.category, 
            serializedModel.rating, 
            serializedModel.ratingCount, 
            serializedModel.author, 
            serializedModel.summary);
        return applicationModel;
    }

    searchInModel(keyword) {
        if (this.name.includes(keyword) || 
        this.category.includes(keyword) || 
        this.author.includes(keyword) || 
        this.summary.includes(keyword)){
            return true;
        }else {
            return false;
        }
    }
}

export default ApplicationModel;
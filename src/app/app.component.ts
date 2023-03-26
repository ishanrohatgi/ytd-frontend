import { Component } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  
  constructor(private  http : HttpClient){

  }
  title = 'youtube-downloader';
  httpResponse: any | never = [];
  videoLink= '';
  videoTitle ='';
  videoChannel ='';
  videoThumbUrl ='';
  rightUrlEntered = false;
  onSearch(){
    console.log(this.videoLink);
    const videoID = this.videoLink.split('=')[1];
    if(this.videoLink.split('=').length>1){
      console.log(videoID);
    this.callYoutubeApi(videoID);
    this.rightUrlEntered = false;
    }
    else{
      console.log('please enter the url !');
      this.rightUrlEntered = true;
    }
    
  }

  callYoutubeApi(videoID: string){
    
    this.http.get<any[]>(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=AIzaSyDV-zEwPfGO97RWrjgNt9X-QPz5PQMikGA`).subscribe(
      (response : any ) => {
        console.log(response); 
        this.videoTitle = response.items[0].snippet.title;
        this.videoChannel = response.items[0].snippet.channelTitle;
        this.videoThumbUrl =response.items[0].snippet.thumbnails.maxres.url;
  },
     
      error => {
        console.error(error);
      }
    );
  }

  download(){
    this.http.get('http://localhost:3000/', { params: { url: this.videoLink, title : this.videoTitle}, responseType: 'blob' }).subscribe((res: Blob) => {
      const downloadUrl = URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${this.videoTitle}.mp4`;
      link.click();
    });
  }
}
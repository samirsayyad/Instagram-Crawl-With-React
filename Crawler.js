import { Component } from "react";
import HTMLParser from "fast-html-parser"
export default class Crawler extends Component {

    constructor(props) {
      super(props);
    }

    async crawlInstagramHtml(url){

        let response =  await fetch( url, { })
        if (response.ok)
            var html = await response.text();
        var root = HTMLParser.parse(html,{script :true});


        var final_picture = null ;
        var final_desc = null ;
        var final_video = null
        var profileImage = null


        let ress = await root.querySelectorAll("script") ;
        var json = null
        for (let i = 0 ; i < ress.length ; i++){
            if (ress[i].text.indexOf("window._sharedData = {\"config\":") > -1)
            json =ress[i].text.split("window._sharedData = ")[1] ;
        }
        var parsed_json = JSON.parse(json) ;

        var all_data = [] ;
        var all_img = [] ;
        var all_vid = [] ;

        if (parsed_json.entry_data.PostPage){
            if (parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children){
                var img_buk_count = (parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges).length ;
                for (var i = 0 ; i < img_buk_count ; i++ ){
                    var img_buk = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges[i].node.display_url
                    var graph = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges[i].node.__typename
                    all_img.push(img_buk) ;
                    if (graph == "GraphVideo"){
                        var vid_buk = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges[i].node.video_url
                        all_vid.push(vid_buk)
                    }
                    all_data.push({img : img_buk , video : vid_buk});
                    vid_buk = "" ;
                    img_buk = "" ;
                }

            }
            if (parsed_json.entry_data){
                final_picture = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.display_url ;
                final_video = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.video_url ;
                final_desc =  parsed_json.entry_data.PostPage[0].graphql.shortcode_media.edge_media_to_caption.edges[0].node.text ;
                username = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.owner.username ;
                profileImage = parsed_json.entry_data.PostPage[0].graphql.shortcode_media.owner.profile_pic_url ;
            }
        }


        return ({
                multiple_post : all_data ,
                single_post : { text:final_desc ,profileImage:profileImage,  img : final_picture , video : final_video } ,
            })


    }
  }

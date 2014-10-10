/**
 * textures.ts
 * Created by xperiments on 09/10/14.
 */
///<reference path="../../reference.ts"/>
interface Window
{
    URL:URL;
    webkitURL:URL;
    revokeObjectURL(url: string): void;
    createObjectURL(object: any, options?: ObjectURLOptions): string;
    BlobBuilder:any;
    MozBlobBuilder:any;
    WebKitBlobBuilder:any;
    Blob:any;

}
module DIXI.textures
{
    export class SVGRasterizer
    {
        /*
        static supportsBlobBuilding():boolean
        {
            return false;
            // Newer WebKit (under PhantomJS) seems to support blob building, but loading an image with the blob fails
            if (window.navigator.userAgent.indexOf("WebKit") >= 0 && window.navigator.userAgent.indexOf("Chrome") < 0) {
                return false;
            }
            if (window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder) {
                // Deprecated interface
                return true;
            } else {
                if (window.Blob) {
                    // Available as constructor only in newer builds for all Browsers
                    try {
                        new window.Blob(['<b></b>'], { "type" : "text\/xml" });
                        return true;
                    } catch (err) {
                        return false;
                    }
                }
            }
            return false;
        }

        static getBlob(data) {
            var imageType = "image/svg+xml;charset=utf-8",
                BLOBBUILDER = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder,
                svg;
            if (BLOBBUILDER ) {
                svg = new BLOBBUILDER();
                svg.append(data);
                return svg.getBlob(imageType);
            } else {

                return new window.Blob([data], {"type": imageType});
            }
        }*/
        static buildImageUrl(svg:string):any
        {
//            var DOMURL = window.URL || window.webkitURL || window;
//            if (SVGRasterizer.supportsBlobBuilding()) {
//                return DOMURL.createObjectURL(SVGRasterizer.getBlob(svg));
//            } else {
                return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
//            }
        }
        static xml2Str(xmlNode:any):string
        {
            try {
                // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
                return (new XMLSerializer()).serializeToString(xmlNode);
            }
            catch (e) {
                try {
                    // Internet Explorer.
                    return xmlNode.xml;
                }
                catch (e) {
                    //Other browsers without XML Serializer
                    alert('Xmlserializer not supported');
                }
            }
            return null;
        }

        /**
         *
         * @param svg
         * @param scale
         */
        public static rasterize( svg:Element , scale:number ):Promise<HTMLCanvasElement>
        public static rasterize( svg:string , scale:number ):Promise<HTMLCanvasElement>
        public static rasterize( svg:any , scale:number = 1 ):Promise<HTMLCanvasElement>
        {

            var data:string = svg instanceof Element ? SVGRasterizer.xml2Str(svg):svg;
            var promise = new Promise(function( resolve,reject ){

                var canvas:HTMLCanvasElement = document.createElement('canvas');
                var ctx:CanvasRenderingContext2D  = canvas.getContext('2d');
//                var DOMURL:URL = window.URL || window.webkitURL || window;
                var img:HTMLImageElement = document.createElement('img');

                var url:string = SVGRasterizer.buildImageUrl( data );
                img.addEventListener('load', ()=> {
                    canvas.width = img.width*scale;
                    canvas.height = img.height*scale;
                    ctx.scale(scale,scale);
                    ctx.clearRect(0,0,img.width*scale,img.height*scale);
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas);
                });

                img.src = url;
//                SVGRasterizer.supportsBlobBuilding() && DOMURL.revokeObjectURL(url);
            });

            return promise;

        }
    }
}
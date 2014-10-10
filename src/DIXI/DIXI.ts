///<reference path="../reference.ts"/>


interface IHttpRequest {
    new(init?:string):IHttpRequest;
    timeout:number;
    responseText:string;
    onerror:()=>void;
    ontimeout:()=>void;
    onprogress:()=>void;
    onload:()=>void;
    open(a, b, c);
    send();
}
interface Window {
    XDomainRequest:IHttpRequest;
    XMLHttpRequest:IHttpRequest;
    ActiveXObject:IHttpRequest;
}


module DIXI {


    import BaseTexture = PIXI.BaseTexture;


    import SVGRasterizer = DIXI.textures.SVGRasterizer;
    import Canvas = DIXI.canvas.Canvas;


    export class AssetLoader extends PIXI.AssetLoader {
        constructor(assetURLs:string[], crossorigin?:boolean) {
            super(assetURLs, crossorigin);
            this.loadersByType['ajpg'] = DIXI.AlphaImageLoader;
            this.loadersByType['svg'] = DIXI.SVGLoader;
            this.loadersByType['asvg'] = DIXI.SVGAtlasLoader;
        }
    }

    export class AlphaImageLoader extends PIXI.ImageLoader {
        /*override*/
        onLoaded() {
            this.texture.baseTexture = new BaseTexture(Canvas.getMaskedJpg(this.texture.baseTexture.source, null, true, true));
            this.dispatchEvent({type: 'loaded', content: this});
        }
    }

    export class SVGLoader extends PIXI.JsonLoader {
        static svgCache:{ [file:string]:string; } = {};

        constructor(url:string, crossorigin?:boolean, private scale:number = 1) {
            super(url, crossorigin);
        }

        texture:PIXI.Texture;

        onJSONLoaded() {
            var svgContent:string = this['ajaxRequest'].responseText;
            SVGLoader.svgCache[ this.url ] = svgContent;

            // TextureAtlas
            if( svgContent.indexOf('___svgroot___')===-1)
            {
                var svgElementsRegExp = /<!--#([a-zA-Z0-9.-_$]*)-->([\s\S]*?)<!--##-->/g;
                var results;
                while( results = svgElementsRegExp.exec(svgContent) )
                {
                    console.dir( results );
                }
            }


            textures.SVGRasterizer.rasterize(svgContent, this.scale).then((canvas:HTMLCanvasElement)=> {
                this.texture = PIXI.Texture.fromCanvas(canvas);
                PIXI.TextureCache[ this.url ] = this.texture;
                this.dispatchEvent({type: 'loaded', content: this});
            })
        }

    }

    export class SVGAtlasLoader extends PIXI.EventTarget {


        public loaded:boolean;
        public baseUrl:string;

        private scaleFactor:number = 1;
        private json:PIXI.ISpriteSheet;
        private texture:PIXI.BaseTexture;
        private ajaxRequest:IHttpRequest;

        constructor(public url:string, public crossorigin?:boolean) {
            super();
            if (url.indexOf('@') != -1) {
                var factor = parseInt(this.url.split('@')[1].split('.')[0]);
                if (factor > 99) {
                    factor /= 100;
                }
                else if (factor > 10) {
                    factor /= 10;
                }
                this.scaleFactor = factor;
                this.url = this.url.split('@')[0] + '.asvg';
            }
            this.baseUrl = url.replace(/[^\/]*$/, '');
            this.loaded = false;

        }

        public load():void {

            if (window.XDomainRequest && this.crossorigin) {
                this.ajaxRequest = new window.XDomainRequest();

                // XDomainRequest has a few querks. Occasionally it will abort requests
                // A way to avoid this is to make sure ALL callbacks are set even if not used
                // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
                this.ajaxRequest.timeout = 3000;

                this.ajaxRequest.onerror = function () {
                    this.onError();
                };

                this.ajaxRequest.ontimeout = function () {
                    this.onError();
                };

                this.ajaxRequest.onprogress = function () {
                };

            }
            else if (window.XMLHttpRequest) {
                this.ajaxRequest = new window.XMLHttpRequest();
            }
            else {
                this.ajaxRequest = new window.ActiveXObject('Microsoft.XMLHTTP');
            }


            this.ajaxRequest.onload = ()=> {
                this.onJSONLoaded();
            };

            this.ajaxRequest.open('GET', this.url, true);

            this.ajaxRequest.send();
        }

        public loadString(svg:string):void {
            this.ajaxRequest.responseText = svg;
        }

        private onError() {

            this.dispatchEvent({
                type: 'error',
                content: this
            });

        }


        private onJSONLoaded() {

            this.json = <PIXI.ISpriteSheet>JSON.parse(this.ajaxRequest.responseText);

            var textureUrl = this.baseUrl + this.json.meta.image;
            var image = new SVGLoader(textureUrl, this.crossorigin, this.scaleFactor);
            var frameData:PIXI.ISpriteSheetFrames = this.json.frames;


            image.addEventListener('loaded', ()=> {

                this.texture = image.texture.baseTexture;

                for (var i in frameData) {
                    var rect:PIXI.ISpriteSheetFrame = frameData[i].frame;

                    if (rect) {
                        PIXI.TextureCache[i] = new PIXI.Texture(this.texture, <PIXI.Rectangle>{
                            x: rect.x * this.scaleFactor,
                            y: rect.y * this.scaleFactor,
                            width: rect.w * this.scaleFactor,
                            height: rect.h * this.scaleFactor
                        });

                        PIXI.TextureCache[i].crop = new PIXI.Rectangle(rect.x * this.scaleFactor, rect.y * this.scaleFactor, rect.w * this.scaleFactor, rect.h * this.scaleFactor);

                        //  Check to see if the sprite is trimmed
                        if (frameData[i].trimmed) {
                            var actualSize = frameData[i].sourceSize;
                            var realSize = frameData[i].spriteSourceSize;
                            PIXI.TextureCache[i].trim = new PIXI.Rectangle(realSize.x * this.scaleFactor, realSize.y * this.scaleFactor, actualSize.w * this.scaleFactor, actualSize.h * this.scaleFactor);
                        }
                    }
                }
                this.onLoaded();
            });

            image.load();

        }

        private onLoaded() {
            this.loaded = true;
            this.dispatchEvent({
                type: 'loaded',
                content: this
            });
        }

    }
}
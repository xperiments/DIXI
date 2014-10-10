var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DIXI;
(function (DIXI) {
    var BaseTexture = PIXI.BaseTexture;
    var Canvas = DIXI.canvas.Canvas;
    var AssetLoader = (function (_super) {
        __extends(AssetLoader, _super);
        function AssetLoader(assetURLs, crossorigin) {
            _super.call(this, assetURLs, crossorigin);
            this.loadersByType['ajpg'] = DIXI.AlphaImageLoader;
            this.loadersByType['svg'] = DIXI.SVGLoader;
            this.loadersByType['asvg'] = DIXI.SVGAtlasLoader;
        }
        return AssetLoader;
    })(PIXI.AssetLoader);
    DIXI.AssetLoader = AssetLoader;
    var AlphaImageLoader = (function (_super) {
        __extends(AlphaImageLoader, _super);
        function AlphaImageLoader() {
            _super.apply(this, arguments);
        }
        AlphaImageLoader.prototype.onLoaded = function () {
            this.texture.baseTexture = new BaseTexture(Canvas.getMaskedJpg(this.texture.baseTexture.source, null, true, true));
            this.dispatchEvent({ type: 'loaded', content: this });
        };
        return AlphaImageLoader;
    })(PIXI.ImageLoader);
    DIXI.AlphaImageLoader = AlphaImageLoader;
    var SVGLoader = (function (_super) {
        __extends(SVGLoader, _super);
        function SVGLoader(url, crossorigin, scale) {
            if (scale === void 0) { scale = 1; }
            _super.call(this, url, crossorigin);
            this.scale = scale;
        }
        SVGLoader.prototype.onJSONLoaded = function () {
            var _this = this;
            var svgContent = this['ajaxRequest'].responseText;
            SVGLoader.svgCache[this.url] = svgContent;
            if (svgContent.indexOf('___svgroot___') === -1) {
                var svgElementsRegExp = /<!--#([a-zA-Z0-9.-_$]*)-->([\s\S]*?)<!--##-->/g;
                var results;
                while (results = svgElementsRegExp.exec(svgContent)) {
                    console.dir(results);
                }
            }
            DIXI.textures.SVGRasterizer.rasterize(svgContent, this.scale).then(function (canvas) {
                _this.texture = PIXI.Texture.fromCanvas(canvas);
                PIXI.TextureCache[_this.url] = _this.texture;
                _this.dispatchEvent({ type: 'loaded', content: _this });
            });
        };
        SVGLoader.svgCache = {};
        return SVGLoader;
    })(PIXI.JsonLoader);
    DIXI.SVGLoader = SVGLoader;
    var SVGAtlasLoader = (function (_super) {
        __extends(SVGAtlasLoader, _super);
        function SVGAtlasLoader(url, crossorigin) {
            _super.call(this);
            this.url = url;
            this.crossorigin = crossorigin;
            this.scaleFactor = 1;
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
        SVGAtlasLoader.prototype.load = function () {
            var _this = this;
            if (window.XDomainRequest && this.crossorigin) {
                this.ajaxRequest = new window.XDomainRequest();
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
            this.ajaxRequest.onload = function () {
                _this.onJSONLoaded();
            };
            this.ajaxRequest.open('GET', this.url, true);
            this.ajaxRequest.send();
        };
        SVGAtlasLoader.prototype.loadString = function (svg) {
            this.ajaxRequest.responseText = svg;
        };
        SVGAtlasLoader.prototype.onError = function () {
            this.dispatchEvent({
                type: 'error',
                content: this
            });
        };
        SVGAtlasLoader.prototype.onJSONLoaded = function () {
            var _this = this;
            this.json = JSON.parse(this.ajaxRequest.responseText);
            var textureUrl = this.baseUrl + this.json.meta.image;
            var image = new SVGLoader(textureUrl, this.crossorigin, this.scaleFactor);
            var frameData = this.json.frames;
            image.addEventListener('loaded', function () {
                _this.texture = image.texture.baseTexture;
                for (var i in frameData) {
                    var rect = frameData[i].frame;
                    if (rect) {
                        PIXI.TextureCache[i] = new PIXI.Texture(_this.texture, {
                            x: rect.x * _this.scaleFactor,
                            y: rect.y * _this.scaleFactor,
                            width: rect.w * _this.scaleFactor,
                            height: rect.h * _this.scaleFactor
                        });
                        PIXI.TextureCache[i].crop = new PIXI.Rectangle(rect.x * _this.scaleFactor, rect.y * _this.scaleFactor, rect.w * _this.scaleFactor, rect.h * _this.scaleFactor);
                        if (frameData[i].trimmed) {
                            var actualSize = frameData[i].sourceSize;
                            var realSize = frameData[i].spriteSourceSize;
                            PIXI.TextureCache[i].trim = new PIXI.Rectangle(realSize.x * _this.scaleFactor, realSize.y * _this.scaleFactor, actualSize.w * _this.scaleFactor, actualSize.h * _this.scaleFactor);
                        }
                    }
                }
                _this.onLoaded();
            });
            image.load();
        };
        SVGAtlasLoader.prototype.onLoaded = function () {
            this.loaded = true;
            this.dispatchEvent({
                type: 'loaded',
                content: this
            });
        };
        return SVGAtlasLoader;
    })(PIXI.EventTarget);
    DIXI.SVGAtlasLoader = SVGAtlasLoader;
})(DIXI || (DIXI = {}));
var DIXI;
(function (DIXI) {
    var canvas;
    (function (canvas) {
        var isIE9 = document.all && !window.atob;
        var ie9_xor = {
            component: function (comp_src, comp_dst, alpha_src, alpha_dst) { return comp_src * alpha_src * (1 - alpha_dst) + comp_dst * alpha_dst * (1 - alpha_src); },
            alpha: function (alpha_src, alpha_dst) { return alpha_src + alpha_dst - 2 * alpha_src * alpha_dst; }
        };
        var Canvas = (function () {
            function Canvas() {
            }
            Canvas.create = function (width, height, renderFunction) {
                var buffer = document.createElement('canvas');
                buffer.width = width;
                buffer.height = height;
                renderFunction && renderFunction(buffer.getContext('2d'));
                return buffer;
            };
            Canvas.getInverseAlphaMask = function (image, jpegMask) {
                if (jpegMask === void 0) { jpegMask = false; }
                return Canvas.create(image.width, image.height, function (ctx) {
                    ctx.drawImage(image, 0, 0);
                    var idata = ctx.getImageData(0, 0, image.width, image.height);
                    var data = idata.data;
                    var alpha;
                    var pixelColor;
                    for (var i = 0; i < data.length; i += 4) {
                        alpha = data[i + 3];
                        pixelColor = 255 - alpha;
                        data[i] = data[i + 1] = data[i + 2] = 255 - (pixelColor);
                        data[i + 3] = jpegMask ? 255 : pixelColor;
                    }
                    ctx.putImageData(idata, 0, 0);
                });
            };
            Canvas.getMaskedJpg = function (image, alpha, jpegMask, embedMask) {
                if (alpha === void 0) { alpha = null; }
                if (jpegMask === void 0) { jpegMask = false; }
                if (embedMask === void 0) { embedMask = false; }
                var width = image.width / (embedMask ? 2 : 1);
                var height = image.height;
                return Canvas.create(width, height, function (ctx) {
                    if (embedMask || jpegMask) {
                        alpha = Canvas.create(width, height, function (ctx) {
                            ctx.drawImage((embedMask ? image : alpha), embedMask ? width : 0, 0, width, height, 0, 0, width, height);
                            var id = ctx.getImageData(0, 0, width, height);
                            var data = id.data;
                            for (var i = data.length - 1; i > 0; i -= 4) {
                                data[i] = 255 - data[i - 3];
                            }
                            ctx.clearRect(0, 0, width, height);
                            ctx.putImageData(id, 0, 0);
                        });
                    }
                    if (!isIE9) {
                        ctx.drawImage(image, 0, 0);
                        ctx.globalCompositeOperation = 'xor';
                        ctx.drawImage(alpha, 0, 0);
                    }
                    else {
                        var i, x, y, alpha_src, alpha_dst;
                        var alphaImageData = Canvas.create(width, height, function (ctx) {
                            ctx.drawImage(alpha, 0, 0);
                        }).getContext('2d').getImageData(0, 0, width, height).data;
                        var srcCanvas = Canvas.create(width, height, function (ctx) {
                            ctx.drawImage(image, 0, 0);
                        });
                        var imageData = srcCanvas.getContext('2d').getImageData(0, 0, width, height);
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                i = (y * width + x) * 4;
                                alpha_dst = imageData.data[i + 3] / 255;
                                alpha_src = (alphaImageData[i + 3]) / 255;
                                imageData.data[i] = ie9_xor.component(alphaImageData[i], imageData.data[i], alpha_src, alpha_dst);
                                imageData.data[i + 1] = ie9_xor.component(alphaImageData[i + 1], imageData.data[i + 1], alpha_src, alpha_dst);
                                imageData.data[i + 2] = ie9_xor.component(alphaImageData[i + 2], imageData.data[i + 2], alpha_src, alpha_dst);
                                imageData.data[i + 3] = ie9_xor.alpha(alpha_src, alpha_dst) * 255;
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                });
            };
            return Canvas;
        })();
        canvas.Canvas = Canvas;
    })(canvas = DIXI.canvas || (DIXI.canvas = {}));
})(DIXI || (DIXI = {}));
var DIXI;
(function (DIXI) {
    var textures;
    (function (textures) {
        var SVGRasterizer = (function () {
            function SVGRasterizer() {
            }
            SVGRasterizer.buildImageUrl = function (svg) {
                return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
            };
            SVGRasterizer.xml2Str = function (xmlNode) {
                try {
                    return (new XMLSerializer()).serializeToString(xmlNode);
                }
                catch (e) {
                    try {
                        return xmlNode.xml;
                    }
                    catch (e) {
                        alert('Xmlserializer not supported');
                    }
                }
                return null;
            };
            SVGRasterizer.rasterize = function (svg, scale) {
                if (scale === void 0) { scale = 1; }
                var data = svg instanceof Element ? SVGRasterizer.xml2Str(svg) : svg;
                var promise = new Promise(function (resolve, reject) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var img = document.createElement('img');
                    var url = SVGRasterizer.buildImageUrl(data);
                    img.addEventListener('load', function () {
                        canvas.width = img.width * scale;
                        canvas.height = img.height * scale;
                        ctx.scale(scale, scale);
                        ctx.clearRect(0, 0, img.width * scale, img.height * scale);
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas);
                    });
                    img.src = url;
                });
                return promise;
            };
            return SVGRasterizer;
        })();
        textures.SVGRasterizer = SVGRasterizer;
    })(textures = DIXI.textures || (DIXI.textures = {}));
})(DIXI || (DIXI = {}));

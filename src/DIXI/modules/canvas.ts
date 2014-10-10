/**
 * CanvasUtils.ts
 * Created by xperiments on 02/10/14.
 */
///<reference path="../../reference.ts"/>


module DIXI.canvas
{
    // IE9 don't support globalCompositeOperations other than source-in
    // fallback to composite it by manually altering the pixels
    var isIE9:boolean = document.all && !window.atob;
    var ie9_xor = {
        component: (comp_src, comp_dst, alpha_src, alpha_dst) => comp_src * alpha_src * (1 - alpha_dst) + comp_dst * alpha_dst * (1 - alpha_src),
        alpha: (alpha_src, alpha_dst) =>  alpha_src + alpha_dst - 2 * alpha_src * alpha_dst
    };

    import Rectangle = PIXI.Rectangle;

    export class Canvas
    {
        /**
         *
         * @param width
         * @param height
         * @param renderFunction
         * @returns {HTMLCanvasElement}
         */
        static create(width:number, height:number, renderFunction?:(ctx:CanvasRenderingContext2D)=>void ):HTMLCanvasElement {
            var buffer = <HTMLCanvasElement>document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;
            renderFunction && renderFunction(buffer.getContext('2d'));
            return buffer;
        }

        /**
         *
         * @param image
         * @param jpegMask
         * @returns {HTMLCanvasElement}
         */
        static getInverseAlphaMask(image:HTMLCanvasElement, jpegMask:boolean = false):HTMLCanvasElement {

            return Canvas.create( image.width, image.height, ( ctx:CanvasRenderingContext2D )=>{
                ctx.drawImage(image, 0, 0);

                var idata = ctx.getImageData(0, 0, image.width, image.height);
                var data:number[] = idata.data;
                var alpha:number;
                var pixelColor:number;
                for (var i = 0; i < data.length; i += 4) {
                    alpha = data[i + 3];
                    pixelColor = 255 - alpha;
                    data[i] = data[i + 1] = data[i + 2] = 255 - (pixelColor);
                    data[i + 3] = jpegMask ? 255 : pixelColor;
                }
                ctx.putImageData(idata, 0, 0);
            });

        }

        /**
         *
         * @param image
         * @param alpha
         * @param jpegMask
         * @param embedMask
         * @returns {HTMLCanvasElement}
         */
        public static getMaskedJpg( image:HTMLCanvasElement, alpha:HTMLCanvasElement =null, jpegMask:boolean = false, embedMask:boolean = false ):HTMLCanvasElement
        {
            var width = image.width / (embedMask ? 2:1);
            var height = image.height;

            return Canvas.create(width, height, function (ctx) {
                // if mask is jpg then compose a real alpha channel from it.
                if( embedMask || jpegMask )
                {
                    alpha = Canvas.create(width, height, function (ctx) {

                        ctx.drawImage(
                            <HTMLCanvasElement>(embedMask ? image:alpha),embedMask ? width:0, 0, width, height, 0, 0, width, height);
                        var id:ImageData = ctx.getImageData(0, 0, width, height);
                        var data = id.data;
                        for (var i = data.length - 1; i > 0; i -= 4) {
                            data[i] = 255 - data[i - 3];
                        }
                        ctx.clearRect(0, 0, width, height);
                        ctx.putImageData(id, 0, 0);
                    });
                }


                if( !isIE9 )
                {
                    ctx.drawImage(<HTMLCanvasElement>image, 0, 0);
                    ctx.globalCompositeOperation = 'xor';
                    ctx.drawImage(alpha, 0, 0);
                }
                else
                {
                    // IE9 don't support globalCompositeOperations other than source-in
                    // fallback to composite it by manually altering the pixels

                    var i, x, y, alpha_src, alpha_dst;
                    var alphaImageData  = Canvas.create( width,height,(ctx)=>{ ctx.drawImage(alpha,0,0); }).getContext('2d').getImageData(0, 0, width, height).data;
                    var srcCanvas = Canvas.create( width,height,(ctx)=>{ ctx.drawImage(image,0,0); });
                    var imageData = srcCanvas.getContext('2d').getImageData(0,0,width,height);

                    for (y = 0; y < height; y++) {
                        for (x = 0; x < width; x++) {
                            i = (y * width + x) * 4;

                            alpha_dst = imageData.data[i+3] / 255;
                            alpha_src = (alphaImageData[i+3]) / 255;

                            imageData.data[i]   = ie9_xor.component(alphaImageData[i],   imageData.data[i], alpha_src, alpha_dst);
                            imageData.data[i+1] = ie9_xor.component(alphaImageData[i+1], imageData.data[i+1], alpha_src, alpha_dst);
                            imageData.data[i+2] = ie9_xor.component(alphaImageData[i+2], imageData.data[i+2], alpha_src, alpha_dst);
                            imageData.data[i+3] = ie9_xor.alpha(alpha_src, alpha_dst) * 255;
                        }
                    }
                    ctx.putImageData( imageData,0,0);
                }

            });
        }
    }


}


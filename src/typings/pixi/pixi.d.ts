// Type definitions for PIXI 1.3
// Project: https://github.com/GoodBoyDigital/pixi.js/
// Definitions by: xperiments <http://github.com/xperiments>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module PIXI {

    /* ENUMS */
    enum scaleModes {
        DEFAULT = 0,
        LINEAR = 0,
        NEAREST = 1
    }

    enum blendModes {
        NORMAL = 0,
        ADD = 1,
        MULTIPLY = 2,
        SCREEN = 3,
        OVERLAY = 4,
        DARKEN = 5,
        LIGHTEN = 6,
        COLOR_DODGE = 7,
        COLOR_BURN = 8,
        HARD_LIGHT = 9,
        SOFT_LIGHT = 10,
        DIFFERENCE = 11,
        EXCLUSION = 12,
        HUE = 13,
        SATURATION = 14,
        COLOR = 15,
        LUMINOSITY = 16
    }


    /* STATICS */
    export var gl:WebGLRenderingContext;
    export var BaseTextureCache:{
    };
    export var texturesToUpdate:BaseTexture[];
    export var texturesToDestroy:BaseTexture[];
    export var TextureCache:{
        [ frameId:string]:PIXI.Texture;
    };
    export var FrameCache:{
    };


    /* MODULE FUNCTIONS */
    export function autoDetectRenderer(width:number, height:number, view?:HTMLCanvasElement, transparent?:boolean, antialias?:boolean):IPixiRenderer;

    export function FilterBlock(mask:Graphics):void;

    export function MaskFilter(graphics:Graphics):void;


    /* DEBUG METHODS */

    export function runList(x):void;

    /*INTERFACES*/

    export interface IBasicCallback {
        ():void
    }

    export interface IEvent {
        type: string;
        content?: any;
    }
    export interface IEventListener {
        (event:IEvent):void;
    }
    export interface IHitArea {
        contains(x:number, y:number):boolean;
    }

    export interface IInteractionDataCallback {
        (interactionData:InteractionData):void
    }

    export interface IPixiRenderer {
        view: HTMLCanvasElement;
        render(stage:Stage): void;
        resize(width:number, height:number):void;
    }

    export interface IBitmapTextStyle {
        font: string;
        align?: string;
    }

    export interface ITextStyle {
        font?: string;
        stroke?: string;
        fill?: string;
        align?: string;
        strokeThickness?: number;
        wordWrap?: boolean;
        wordWrapWidth?:number;
    }


    /* UPDATED */

    export class AbstractFilter {
        constructor(fragmentSrc:any, uniforms:any);
    }

    export class AjaxRequest {
        bind();

        cancelAnimationFrame();

        canUseNewCanvasBlendModes():boolean;

        getNextPowerOfTwo(number:number):number;

        hex2rgb(hex:string):number[];

        requestAnimationFrame();

        rgb2hex(rgb:number[]):string;
    }

    export class AlphaMaskFilter {
        map:PIXI.Texture;
    }

    export class AtlasLoader extends EventTarget {
        constructor(url:string, crossorigin:boolean);

        load():void;
    }

    /* CLASSES */

    export class AssetLoader extends EventTarget {
        assetURLs:string[];
        crossorigin:boolean;
        loadersByType:{ [types:string]:any }; //x
        onComplete:IBasicCallback;
        onProgress:IBasicCallback;

        constructor(assetURLs:string[], crossorigin?:boolean);

        load():void;
    }

    // some way to force source to HTMLImageElement/HTMLCanvasElement
    export interface IBaseTextureSource {
        width:number;
        height:number;
    }
    export class BaseTexture extends EventTarget {
        height:number;
        width:number;
        hasLoaded:boolean;
        scaleMode:PIXI.scaleModes;
        source:any;

        constructor(source:HTMLImageElement, scaleMode?:PIXI.scaleModes);

        constructor(source:HTMLCanvasElement, scaleMode?:PIXI.scaleModes);

        destroy():void;

        updateSourceImage(newSrc:string):void;

        static fromImage(imageUrl:string, crossorigin?:boolean, scaleMode?:PIXI.scaleModes):BaseTexture;

        static fromCanvas(canvas:HTMLCanvasElement, scaleMode?:PIXI.scaleModes):BaseTexture;
    }

    export class BitmapFontLoader extends EventTarget {
        baseUrl:string;
        crossorigin:boolean;
        texture:Texture;
        url:string;

        constructor(url:string, crossorigin?:boolean);

        load():void;
    }

    export class BitmapText extends DisplayObjectContainer {
        textWidth:number;
        textHeight:number;

        constructor(text:string, style:IBitmapTextStyle);

        setStyle(style:IBitmapTextStyle):void;

        setText(text:string):void;
    }

    export class BlurFilter {
        constructor();

        blur:number;
        blurX:number;
        blurY:number;
    }

    export class CanvasMaskManager {
        popMask(context:CanvasRenderingContext2D):void;

        // TODO what is the maskdata format
        pushMask(maskData:any, context:CanvasRenderingContext2D):void;
    }

    export interface ICanvasRenderSesion {
        context: CanvasRenderingContext2D;
        maskManager: CanvasMaskManager;
        scaleMode: PIXI.scaleModes;
        smoothProperty: string;
    }
    export class CanvasRenderer implements IPixiRenderer {
        maskManager:CanvasMaskManager;
        clearBeforeRender:boolean;
        context:CanvasRenderingContext2D;
        height:number;
        renderSession:ICanvasRenderSesion;
        roundPixels:boolean;
        transparent:boolean;
        view:HTMLCanvasElement;
        width:number;

        constructor(width:number, height:number, view?:HTMLCanvasElement, transparent?:boolean);

        render(stage:Stage):void;

        resize(width:number, height:number):void;
    }

    export class CanvasTinter {
        cacheStepsPerColorChannel:number;
        canUseMultiply:boolean;
        convertTintToImage:boolean;

        constructor();

        getTintedTexture(sprite:PIXI.Sprite, color:number):void;

        roundColor(color:any):string;

        tintPerPixel(texture:PIXI.Texture, color:number, canvas:HTMLCanvasElement):void;

        tintWithMultiply(texture:PIXI.Texture, color:number, canvas:HTMLCanvasElement):void;

        tintWithOverlay(texture:PIXI.Texture, color:number, canvas:HTMLCanvasElement):void;

    }

    export class CanvasBuffer
    {
        width:number;
        height:number;
        context:CanvasRenderingContext2D;
        canvas:HTMLCanvasElement;
        constructor( width:number, height:number );
        clear():void;
        resize( width:number, height:number):void;

    }
    export class Circle implements IHitArea {
        x:number;
        y:number;
        radius:number;

        constructor(x:number, y:number, radius:number);

        clone():Circle;

        contains(x:number, y:number):boolean;
    }

    export class ColorMatrixFilter {
        matrix:number[];
    }

    export class ColorStepFilter {
        step:number;
    }

    export class DisplacementFilter {
        map:Texture;
        offset:Point;
        scale:Point;
    }

    // TODO what is renderGroup
    // removed in 1.5 docs
    /*
     export class CustomRenderable extends DisplayObject
     {
     constructor();
     renderCanvas(renderer: CanvasRenderer): void;
     initWebGL(renderer: WebGLRenderer): void;
     renderWebGL(renderGroup: any, projectionMatrix: any): void;
     }
     */

    export class DisplayObject {
        alpha:number;
        buttonMode:boolean;
        defaultCursor:string;
        filterArea:Rectangle;
        filters:any[];//x
        hitArea:IHitArea;
        interactive:boolean;
        mask:Graphics;
        parent:DisplayObjectContainer;
        pivot:Point;
        position:Point;
        rotation:number;
        renderable:boolean;
        scale:Point;
        stage:Stage;
        visible:boolean;
        worldAlpha:number;
        worldVisible:number;
        x:number;
        y:number;
        cacheAsBitmap:Boolean;
        constructor();

        static autoDetectRenderer(width:number, height:number, view?:HTMLCanvasElement, transparent?:boolean):IPixiRenderer;

        click:IInteractionDataCallback;

        getBounds():Rectangle;

        getLocalBounds():Rectangle;

        generateTexture():Texture;

        mousedown:IInteractionDataCallback;
        mouseout:IInteractionDataCallback;
        mouseover:IInteractionDataCallback;
        mouseup:IInteractionDataCallback;
        mouseupoutside:IInteractionDataCallback;
        mousemove:IInteractionDataCallback;

        setStageReference(stage:Stage):void;

        tap:IInteractionDataCallback;
        touchend:IInteractionDataCallback;
        touchendoutside:IInteractionDataCallback;
        touchstart:IInteractionDataCallback;
        touchmove:IInteractionDataCallback;
    }

    export class DisplayObjectContainer extends DisplayObject {
        children:DisplayObject[];
        width:number;
        height:number;

        constructor();

        addChild(child:DisplayObject):void;

        addChildAt(child:DisplayObject, index:number):void;

        getChildAt(index:number):DisplayObject;

        removeChild(child:DisplayObject):void;

        removeAll():void;

        removeStageReference();

        setStageReference(stage):void;

        swapChildren(child:DisplayObject, child2:DisplayObject):void;

    }
    export class DotScreenFilter {
        angle:number;
        scale:number;
    }
    export class Ellipse implements IHitArea {
        x:number;
        y:number;
        width:number;
        height:number;

        constructor(x:number, y:number, width:number, height:number);

        clone():Ellipse;

        contains(x:number, y:number):boolean;

        getBounds():Rectangle;
    }

    export class EventTarget {
        listeneners:{ [type:string]: IEventListener
        };

        addEventListener(type:string, listener:IEventListener);

        removeEventListener(type:string, listener:IEventListener);

        dispatchEvent(event:IEvent);
    }


    export class FilterTexture {
        fragmentSrc:string[];
        gl:WebGLRenderingContext;
        program:any;

        constructor();

        clear():void;

        destroy():void;

        init():void;

        resize(width:number, height:number):void;
    }
    export class Graphics extends DisplayObjectContainer {
        blendMode:number;
        boundsPadding:number;
        bounds:Rectangle;
        fillAlpha:Number;
        isMask:boolean;
        lineColor:string;
        lineWidth:number;
        tint:number;

        constructor();

        beginFill(color?:number, alpha?:number):void;

        clear():void;

        drawCircle(x:number, y:number, radius:number):void;

        drawElipse(x:number, y:number, width:number, height:number):void;

        drawRect(x:number, y:number, width:number, height:number):void;

        endFill():void;

        generateTexture():Texture;

        getBounds():Rectangle;

        lineStyle(lineWidth?:number, color?:number, alpha?:number):void;

        lineTo(x:number, y:number):void;

        moveTo(x:number, y:number):void;

        updateBounds();

        static POLY:number;
        static RECT:number;
        static CIRC:number;
        static ELIP:number;
    }

    export class GrayFilter {
        gray:number;

        constructor();
    }

    export class ImageLoader extends EventTarget {
        texture:Texture;

        constructor(url:string, crossorigin?:boolean);

        load():void;

        loadFramedSpriteSheet(frameWidth:number, frameHeight:number, textureName:string):void;
    }

    /* TODO determine type of originalEvent*/
    export class InteractionData {
        global:Point;
        local:Point;
        target:DisplayObjectContainer;

        constructor();

        originalEvent:any;

        getLocalPosition(displayObject:DisplayObject):Point;
    }

    export class InteractionManager {
        currentCursorStyle:string;
        mouse:InteractionData;
        mouseOut:boolean;
        mouseoverEnabled:boolean;
        pool:any[];
        stage:Stage;
        touchs:{ [id:string]:InteractionData };
        hitTest(item:DisplayObject, interactionData:InteractionData);
        constructor(stage:Stage);
    }

    export class InvertFilter {
        invert:number;
    }

    export class JsonLoader extends EventTarget {
        url:string;
        crossorigin:boolean;
        baseUrl:string;
        loaded:boolean;

        constructor(url:string, crossorigin?:boolean);

        load():void;
    }

    export class Matrix {
        a:number;
        b:number;
        c:number;
        d:number;
        tx:number;
        ty:number;
    }
    export class MovieClip extends Sprite {
        animationSpeed:number;
        currentFrame:number;
        loop:boolean;
        onComplete:IBasicCallback;
        playing:boolean;
        textures:Texture[];
        totalFrames:number;

        constructor(textures:Texture[]);

        gotoAndPlay(frameNumber:number):void;

        gotoAndStop(frameNumber:number):void;

        play():void;

        stop():void;
    }

    export class Point {
        x:number;
        y:number;

        constructor(x:number, y:number);

        clone():Point;
    }

    export class PolyK {
        Triangulate(points:number[]):number[];
    }

    export class Polygon implements IHitArea {
        points:Point[];

        constructor(points:Point[]);

        constructor(points:number[]);

        constructor(...points:Point[]);

        constructor(...points:number[]);

        clone():Polygon;

        contains(x:number, y:number):boolean;
    }

    export class Rectangle implements IHitArea {
        x:number;
        y:number;
        width:number;
        height:number;

        constructor(x:number, y:number, width:number, height:number);

        clone():Rectangle;

        contains(x:number, y:number):boolean;
    }

    export class Rope {
        constructor(texture:Texture, points:number[]);

        refresh():void;

        resize(width:number, height:number):void;

        setTexture(texture:Texture):void;
    }
    export class SepiaFilter {
        sepia:number;
    }
    export class RenderTexture extends Texture {
        constructor(width:number, height:number);

        resize(width:number, height:number):void;

        static tempMatrix:Matrix;
    }

    export class Sprite extends DisplayObjectContainer {
        anchor:Point;
        blendMode:number;
        height:number;
        texture:Texture;
        tint:number;
        width:number;

        static fromFrame(frameId:string):Sprite;

        static fromImage(url:string):Sprite;

        constructor(texture:Texture);

        setTexture(texture:Texture):void;

    }

    export class SpriteBatch extends DisplayObjectContainer {
        constructor(texture?:Texture);
    }
    /* SpriteSheetJson */

    interface ISpriteSheetFrames { [name:string]:ISpriteSheetItem; }

    interface ISpriteSheet
    {
        frames:ISpriteSheetFrames;
        meta:ISpriteSheetMeta;
    }


    interface ISpriteSheetFrame
    {
        x:number;
        y:number;
        w:number;
        h:number;
    }

    interface ISpriteSheetItem
    {
        frame:ISpriteSheetFrame;
        rotated:boolean;
        trimmed:boolean;
        spriteSourceSize:ISpriteSheetFrame;
        sourceSize:ISpriteSheetSourcesize;
    }

    interface ISpriteSheetMeta
    {
        app:string;
        version:string;
        image:string;
        format:string;
        size:ISpriteSheetSourcesize;
        scale:string;
    }

    interface ISpriteSheetSourcesize
    {
        w:number;
        h:number;
    }
    export class SpriteSheetLoader extends EventTarget {
        url:string;
        crossorigin:boolean;
        baseUrl:string;
        texture:Texture;
        frames:Object;
        json:ISpriteSheet;
        constructor(url:string, crossorigin?:boolean);

        load();
    }

    export class Stage extends DisplayObjectContainer {
        interactive:boolean;
        interactionManager:InteractionManager;

        constructor(backgroundColor:number, interactive?:boolean);

        getMousePosition():Point;

        setBackgroundColor(backgroundColor:number):void;
    }

    export class Text extends Sprite {
        constructor(text:string, style:ITextStyle);

        destroy(destroyTexture:boolean):void;

        setText(text:string):void;

        setStyle(style:ITextStyle):void;
    }

    export class Texture extends EventTarget {
        crop:Rectangle;
        baseTexture:BaseTexture;
        frame:Rectangle;
        trim:Point;
        realSize:{x:number; y:number; w:number; h:number };
        render(displayObject:DisplayObject, position:Point, clear:boolean):void;

        constructor(baseTexture:BaseTexture, frame?:Rectangle);

        destroy(destroyBase:boolean):void;

        setFrame(frame:Rectangle):void;

        static addTextureToCache(texture:Texture, id:string):void;

        static fromCanvas(canvas:HTMLCanvasElement):Texture;

        static fromFrame(frameId:string):Texture;

        static fromImage(imageUrl:string, crossorigin?:boolean):Texture;

        static removeTextureFromCache(id:any):Texture;
    }

    export class TilingSprite extends DisplayObjectContainer {
        width:number;
        height:number;
        texture:Texture;
        tilePosition:Point;
        tileScale:Point;

        constructor(texture:Texture, width:number, height:number);

        setTexture(texture:Texture):void;
    }

    export class WebGLBatch {
        constructor(webGLContext:WebGLRenderingContext);

        clean():void;

        restoreLostContext(gl:WebGLRenderingContext);

        init(sprite:Sprite):void;

        insertAfter(sprite:Sprite, previousSprite:Sprite):void;

        insertBefore(sprite:Sprite, nextSprite:Sprite):void;

        growBatch():void;

        merge(batch:WebGLBatch):void;

        refresh():void;

        remove(sprite:Sprite):void;

        render():void;

        split(sprite:Sprite):WebGLBatch;

        update():void;
    }

    /* Determine type of Object */
    export class WebGLRenderGroup {
        render(projection:Object):void;
    }

    export class WebGLRenderer implements IPixiRenderer {
        view:HTMLCanvasElement;

        constructor(width:number, height:number, view?:HTMLCanvasElement, transparent?:boolean, antialias?:boolean);

        render(stage:Stage):void;

        resize(width:number, height:number):void;
    }

	export class Spine extends DisplayObjectContainer {
		crossorigin:boolean;
		loaded:boolean;
		url:string;

		skeleton:spine.Skeleton;
		stateData:spine.AnimationStateData;
		state:spine.AnimationState;
		constructor( url:string, crossorigin?:boolean );

	}

}

declare function requestAnimFrame(animate:PIXI.IBasicCallback);


declare module PIXI.PolyK {
    export function Triangulate(p:number[]):number[];
}



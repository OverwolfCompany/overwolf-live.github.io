(function() {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
  });

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'),
      drawingOptionsEl = $('drawing-mode-options'),
      drawingColorEl = $('drawing-color'),
      drawingShadowColorEl = $('drawing-shadow-color'),
      drawingLineWidthEl = $('drawing-line-width'),
      drawingShadowWidth = $('drawing-shadow-width'),
      drawingShadowOffset = $('drawing-shadow-offset'),
      clearEl = $('clear-canvas'),
	  bb = $('b');

  clearEl.onclick = function() { canvas.clear() };

  drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Скрыть панель';
      drawingOptionsEl.style.display = '';
    }
    else {
      drawingModeEl.innerHTML = 'Открыть панель';
      drawingOptionsEl.style.display = 'none';
    }
  };

  if (fabric.паттернBrush) {
    var vLinePatternBrush = new fabric.паттернBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.паттернBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.паттернBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.паттернBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = 'white.png';

    var texturePatternBrush = new fabric.паттернBrush(canvas);
    texturePatternBrush.source = img;
  }

  $('drawing-mode-selector').onchange = function() {

    if (this.value === 'горизонтальная линия') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    }
    else if (this.value === 'вертикальная линия') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    }
    else if (this.value === 'квадрат') {
      canvas.freeDrawingBrush = squarePatternBrush;
    }
    else if (this.value === 'бриллиант') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    }
    else if (this.value === 'ластик') {
      canvas.freeDrawingBrush = texturePatternBrush;
    }	
    else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };

  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function() {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function() {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  }

  window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');  // $('img')[0]
          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
          img.onload = imageIsLoaded;
          
      }
  });
});

function imageIsLoaded() { 
  alert(this.src);  // blob url
  // update width and height ...
}

      let fileInput = document.getElementById('fileinput');

fileInput.addEventListener('change', function(ev) {
    console.log(ev.target.files);
  if(ev.target.files) {
    let file = ev.target.files[0];
    var reader  = new FileReader();

    reader.onloadend = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function(ev) {
        var canvas = document.getElementById('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
         var ctx = canvas.getContext('2d');
        ctx.drawImage(image,100,100);
      }
    }
    reader.readAsDataURL(file);

  }
});  
  
  bb.onclick = function(){

var dataURL = canvas.toDataURL({
  format: 'png',
  quality: 1
});

var link = document.createElement('a');
link.href = dataURL;
link.download = 'image.png';
var par = document.getElementById('drawing-mode-options');
par.appendChild(link);
link.click();
}
  
}());
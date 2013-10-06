/**
Copyright (c) 2010 Dennis Hotson

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {

jQuery.fn.springy = function(params) {
	var graph = this.graph = params.graph || new Springy.Graph();

	var stiffness = params.stiffness || 100.0; 		// 400
	var repulsion = params.repulsion || 1000.0; 		// 400
	var damping = params.damping || 0.001; 			// 0.5
	var nodeSelected = params.nodeSelected || null;

	var canvas = this[0];
	var ctx = canvas.getContext("2d");

	var layout = this.layout = new Springy.Layout.ForceDirected(graph, stiffness, repulsion, damping);

	// calculate bounding box of graph layout.. with ease-in
	var currentBB = layout.getBoundingBox();
	var targetBB = {bottomleft: new Springy.Vector(-2, -2), topright: new Springy.Vector(2, 2)};

	// auto adjusting bounding box
	Springy.requestAnimationFrame(function adjust() {
		targetBB = layout.getBoundingBox();
		// current gets 20% closer to target every iteration
		currentBB = {
			bottomleft: currentBB.bottomleft.add( targetBB.bottomleft.subtract(currentBB.bottomleft)
				.divide(10)),
			topright: currentBB.topright.add( targetBB.topright.subtract(currentBB.topright)
				.divide(10))
		};

		Springy.requestAnimationFrame(adjust);
	});

	var verticalPadding = 80;
	var horizontalPadding = 150;

	// convert to/from screen coordinates
	var toScreen = function(p) {
		var size = currentBB.topright.subtract(currentBB.bottomleft);
		var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * (canvas.width - horizontalPadding*2) + horizontalPadding;
		var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * (canvas.height - verticalPadding*2) + verticalPadding;
		return new Springy.Vector(sx, sy);
	};

	var fromScreen = function(s) {
		var size = currentBB.topright.subtract(currentBB.bottomleft);
		var px = (s.x / (canvas.width - horizontalPadding*2)) * size.x + currentBB.bottomleft.x - horizontalPadding;
		var py = (s.y / (canvas.height - verticalPadding*2)) * size.y + currentBB.bottomleft.y - verticalPadding;
		return new Springy.Vector(px, py);
	};

/*
	// half-assed drag and drop
	var selected = null;
	var nearest = null;
	var dragged = null;

	jQuery(canvas).mousedown(function(e) {
		var pos = jQuery(this).offset();
		var p = fromScreen({x: e.pageX - pos.left, y: e.pageY - pos.top});
		selected = nearest = dragged = layout.nearest(p);

		if (selected.node !== null) {
			dragged.point.m = 10000.0;

			if (nodeSelected) {
				nodeSelected(selected.node);
			}
		}

		renderer.start();
	});

	// Basic double click handler
	jQuery(canvas).dblclick(function(e) {
		var pos = jQuery(this).offset();
		var p = fromScreen({x: e.pageX - pos.left, y: e.pageY - pos.top});
		selected = layout.nearest(p);
		node = selected.node;
		if (node && node.data && node.data.ondoubleclick) {
			node.data.ondoubleclick();
		}
	});

	jQuery(canvas).mousemove(function(e) {
		var pos = jQuery(this).offset();
		var p = fromScreen({x: e.pageX - pos.left, y: e.pageY - pos.top});
		nearest = layout.nearest(p);

		if (dragged !== null && dragged.node !== null) {
			dragged.point.p.x = p.x;
			dragged.point.p.y = p.y;
		}

		renderer.start();
	});

	jQuery(window).bind('mouseup',function(e) {
		dragged = null;
	});
*/

	Springy.Node.prototype.getWidth = function() {		
		var text = (this.data.name !== undefined) ? this.data.name : this.id;
		if (this._width && this._width[text])
			return this._width[text];

		ctx.save();
		ctx.font = "18px 'Helvetica Neue', Arial";
		var width = ctx.measureText(text).width + 30;
		ctx.restore();

		this._width || (this._width = {});
		this._width[text] = width;

		return width;
	};

	Springy.Node.prototype.getHeight = function() {
		return 20;
	};

	var renderer = this.renderer = new Springy.Renderer(layout,
		function clear() {
			ctx.clearRect(0,0,canvas.width,canvas.height);
		},
		function drawEdge(edge, p1, p2) {
						
			var x1 = toScreen(p1).x;
			var y1 = toScreen(p1).y;
			var x2 = toScreen(p2).x;
			var y2 = toScreen(p2).y;

			var direction = new Springy.Vector(x2-x1, y2-y1);
			var normal = direction.normal().normalise();

			var from = graph.getEdges(edge.source, edge.target);
			var to = graph.getEdges(edge.target, edge.source);

			var total = from.length + to.length;

			// Figure out edge's position in relation to other edges between the same nodes
			var n = 0;
			for (var i=0; i<from.length; i++) {
				if (from[i].id === edge.id) {
					n = i;
				}
			}

			var spacing = 6.0;

			// Figure out how far off center the line should be drawn
			var offset = normal.multiply(-((total - 1) * spacing)/2.0 + (n * spacing));

			var s1 = toScreen(p1).add(offset);
			var s2 = toScreen(p2).add(offset);

			var boxWidth = edge.target.getWidth();
			var boxHeight = edge.target.getHeight();

			var intersection = intersect_line_box(s1, s2, {x: x2-boxWidth/2.0, y: y2-boxHeight/2.0}, boxWidth, boxHeight);

			if (!intersection) {
				intersection = s2;
			}

			// line
			var stroke = (edge.data.color !== undefined) ? edge.data.color : '#999999';
			var weight = 0.5;
			ctx.lineWidth = Math.max(weight *  2, 0.1);
			var lineEnd = s2;

			ctx.strokeStyle = stroke;
			ctx.beginPath();
			ctx.moveTo(s1.x, s1.y);
			ctx.lineTo(lineEnd.x, lineEnd.y);
			ctx.stroke();

			//draw circles at the end points
			var radius = 20;
			ctx.fillStyle = "#fff";
			ctx.beginPath();
			// ctx.arc(s1.x, s1.y, radius, 0, 2*Math.PI, false);
			ctx.rect(s1.x - radius, s1.y - radius, radius * 2, radius * 2);
			ctx.fill();

			ctx.beginPath();
			// ctx.arc(lineEnd.x, lineEnd.y, radius, 0, 2*Math.PI, false);
			ctx.rect(lineEnd.x - radius, lineEnd.y - radius, radius * 2, radius * 2);
			ctx.fill();


		},
		function drawNode(node, p) {
						
			var s = toScreen(p);

			ctx.save();

			var boxWidth = node.getWidth();
			var boxHeight = node.getHeight();

			// clear background
			// ctx.clearRect(s.x - boxWidth/2, s.y - 10, boxWidth, 20);

			// node label
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = (node.data.theme !== undefined) ? node.data.theme : 'black';
			switch (node.data.theme) {
				case 'red':
					ctx.fillStyle = '#ff001a';
				break;
				case 'green':
					ctx.fillStyle = '#00992d';
				break;
				case 'blue-light':
					ctx.fillStyle = '#00b1ea';
				break;
				case 'blue-dark':
					ctx.fillStyle = '#006fb8';
				break;
				case 'purple':
					ctx.fillStyle = '#93288a';
				break;
				case 'orange':
					ctx.fillStyle = '#dd9122';
				break;
			}
			
			ctx.font = "28px 'Helvetica Neue', Arial";
			var text = (node.data.name !== undefined) ? node.data.name : node.id;
			ctx.fillText(text, s.x - boxWidth/2 + 0, s.y - 16);
			
			// node box
			// ctx.fillRect(s.x - boxWidth/2 + 5, s.y - 8, 16, 16);

			ctx.restore();
		},
		function onRenderStart(){
			//console.log('Springy: started');			
		}, 
		function onRenderStop(){
			//console.log('Springy: finished');
		}
	);

	renderer.start();

	// helpers for figuring out where to draw arrows
	function intersect_line_line(p1, p2, p3, p4) {
		var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));

		// lines are parallel
		if (denom === 0) {
			return false;
		}

		var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
		var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

		if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
			return false;
		}

		return new Springy.Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
	}

	function intersect_line_box(p1, p2, p3, w, h) {
		var tl = {x: p3.x, y: p3.y};
		var tr = {x: p3.x + w, y: p3.y};
		var bl = {x: p3.x, y: p3.y + h};
		var br = {x: p3.x + w, y: p3.y + h};

		var result;
		if (result = intersect_line_line(p1, p2, tl, tr)) { return result; } // top
		if (result = intersect_line_line(p1, p2, tr, br)) { return result; } // right
		if (result = intersect_line_line(p1, p2, br, bl)) { return result; } // bottom
		if (result = intersect_line_line(p1, p2, bl, tl)) { return result; } // left

		return false;
	}

	return this;
}

})();

var Endabgabe_EIA2;
(function (Endabgabe_EIA2) {
    class Firework {
        position;
        size;
        endSize;
        color;
        constructor(_position, _endSize, _color) {
            this.position = _position;
            this.size = Endabgabe_EIA2.size;
            this.endSize = _endSize;
            this.color = _color;
        }
        //Zeichnet das Feuerwerk
        draw() {
            //wenn die aktuelle Größe des Feuerwerks kleiner ist als die festgelegte End Größe -> zeichne erneut
            if (this.size < this.endSize) {
                Endabgabe_EIA2.crc2.save();
                Endabgabe_EIA2.crc2.beginPath();
                Endabgabe_EIA2.crc2.globalAlpha = 0.1;
                Endabgabe_EIA2.crc2.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
                Endabgabe_EIA2.crc2.fillStyle = this.color;
                Endabgabe_EIA2.crc2.fill();
                Endabgabe_EIA2.crc2.closePath();
                Endabgabe_EIA2.crc2.restore();
            }
        }
        //Aktualisiert die zu zeichnende Größe 
        update() {
            Endabgabe_EIA2.size = this.size + 10;
        }
    }
    Endabgabe_EIA2.Firework = Firework;
})(Endabgabe_EIA2 || (Endabgabe_EIA2 = {}));
//# sourceMappingURL=firework.js.map
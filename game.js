const buttonSubmit = document.getElementById('inputCriarGame')
const canvas = document.getElementById('jogo')
const ctx = canvas.getContext('2d')

var tiles = []
var nTilesX
var nTilesY
var lenTilesPx
var lineTilesPx
var nBombs
var count

function getTile(i, j) {
    return tiles.find(t => t.i == i && t.j == j)
}

function draw() {
    ctx.clearRect(0, 0, count, count)
    tiles.map(t => {
        drawTile(t)
    })
}

function openAround(tile) {
    tile.openAround = true
    for (let i = tile.i - 1; i <= tile.i + 1; i++) {
        for (let j = tile.j - 1; j <= tile.j + 1; j++) {
            if (i != tile.i || j != tile.j) {
                const currentTile = getTile(i, j)
                if (currentTile && !currentTile.isBomb) openTile(currentTile)
            }
        }
    }
}

function openTile(tile) {
    tile.isOpen = true
    if (!tile.openAround && tile.bombsAround == 0) openAround(tile)
}

buttonSubmit.addEventListener('click', e => {
    const inputX = document.getElementById("inputX").value
    const inputY = document.getElementById("inputY").value
    const inputBombs = document.getElementById("inputBombs").value


    var tiles = []
    // const nTilesX = 10;
    var nTilesX = inputX
    var nTilesY = inputY
    // const nTilesy = 10;
    var lenTilesPx = 5
    var lineTilesPx = 1
    // var nBombs = 30
    var nBombs = inputBombs
    var count = (((nTilesX * nTilesY) * lenTilesPx) + (lineTilesPx * lenTilesPx) + 1)

    canvas.setAttribute('width', count.toString())
    canvas.setAttribute('height', count.toString())


    class Tile {
        constructor(i, j) {
            this.i = i;
            this.j = j;
            this.isBomb = false;
            this.isOpen = false;
            this.bombsAround = 0;
            this.marked = false;
            this.openAround = false;
        }
    }
    function generateTiles() {
        for (let i = 0; i < nTilesX; i++) {
            for (let j = 0; j < nTilesY; j++) {
                let tile = new Tile(i, j);
                tiles.push(tile);
            }
        }
    }

    function generateBombs() {
        for (let i = 0; i < nBombs; i++) {
            let random = Math.floor(Math.random() * tiles.filter(t => !t.isBomb).length);
            tiles.filter(t => !t.isBomb)[random].isBomb = true
        }
    }

    function generateNBombs() {
        tiles.map(t => {
            const nBombs = calculateNBombsAround(t)
            t.bombsAround = nBombs
        })
    }

    function calculateNBombsAround(tile) {
        let bombCounter = 0
        for (let i = tile.i - 1; i <= tile.i + 1; i++) {
            for (let j = tile.j - 1; j <= tile.j + 1; j++) {
                if (i != tile.i || j != tile.j) {
                    if (getTile(i, j)?.isBomb) bombCounter += 1;
                }
            }
        }
        return bombCounter
    }

    function getTile(i, j) {
        return tiles.find(t => t.i == i && t.j == j)
    }

    generateTiles();
    function draw() {
        ctx.clearRect(0, 0, count, count)
        tiles.map(t => {
            drawTile(t)
        })
    }

    function drawTile(tile) {
        let x = (tile.i * ((nTilesX * lenTilesPx) + 1) + 1)
        let y = (tile.j * ((nTilesY * lenTilesPx) + 1) + 1)
        if (tile.isOpen) {
            if (tile.isBomb) {
                ctx.fillStyle = "#ff0000"
                ctx.fillRect(x, y, (nTilesX * lenTilesPx), (nTilesY * lenTilesPx))
            } else {
                ctx.fillStyle = "#999999"
                ctx.fillRect(x, y, (nTilesX * lenTilesPx), (nTilesY * lenTilesPx))
                if (tile.bombsAround) {
                    ctx.font = "30px Arial"
                    ctx.textAlign = "center"
                    ctx.fillStyle = "red"
                    ctx.fillText(tile.bombsAround, x + 25, y + 38)
                }
            }

        } else {
            if (tile.marked) {
                ctx.fillStyle = "#0000ff"
            }
            else {
                ctx.fillStyle = "#aaaaaa"
            }
            ctx.fillRect(x, y, (nTilesX * lenTilesPx), (nTilesY * lenTilesPx))
        }
    }

    function openTile(tile) {
        tile.isOpen = true
        if (!tile.openAround && tile.bombsAround == 0) openAround(tile)
    }

    function openAround(tile) {
        tile.openAround = true
        for (let i = tile.i - 1; i <= tile.i + 1; i++) {
            for (let j = tile.j - 1; j <= tile.j + 1; j++) {
                if (i != tile.i || j != tile.j) {
                    const currentTile = getTile(i, j)
                    if (currentTile && !currentTile.isBomb) openTile(currentTile)
                }
            }
        }
    }

    generateBombs()
    generateNBombs()
    draw()

})

document.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const i = Math.floor((mouseX / count) * 10)
    const j = Math.floor((mouseY / count) * 10)

    let tile = getTile(i, j)
    openTile(tile)
    tile.isOpen = true
    draw()
})


document.addEventListener("contextmenu", e => {
    e.preventDefault()
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const i = Math.floor((mouseX / count) * nTilesX)
    const j = Math.floor((mouseY / count) * nTilesY)

    let tile = getTile(i, j)
    tile.marked = !tile.marked
    draw()
})
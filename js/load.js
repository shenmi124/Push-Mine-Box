function loadingGame(){
    player.data.grid = {}
    player.data.level = []
    player.data.enterLevelPosition = []

    enterLevel([0, 0], 'world')
    enterLevel([0, 0], 'w0')
}
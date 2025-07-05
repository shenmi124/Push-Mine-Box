function calcPlayer(){
    loader(['data','offline'], n(0))
    loader(['data','devSpeed'], n(1))

    loader(['setting','notation'], 'scientific')

    loader(['data','console'], false)

    loader(['data','colSize'], n(1))
    loader(['data','rowSize'], n(1))
    
    loader(['data','grid'], {})
    loader(['data','level'], [])
    loader(['data','enterLevelPosition'], [])
    
    loader(['data','wonlevel'], [])
}
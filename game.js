var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        cards: [],
        teamOneName: 'Dan Team',
        teamOnePoints: 0,
        teamTwoName: 'Ana Team',
        teamTwoPoints: 0,
        gameOn: false,
        currentTeam: '',
        risky: true,
        pickNumber: 1,
        activeTeamPoints: 0,
        cardPossibilities: [0, 0, 0, 0, 100, 200, 300, 400, 500]
    },
    methods: {
        generateCards: function (notRisky) {
            this.changeTeam(this.currentTeam)
            this.cards = []
            for (var i = 0; i < _.range(24).length; i++) {
                var multiplier = 4
                var cardPossibilities = [0, 100, 200, 300, 400, 500, 500]
                if (notRisky) {
                    multiplier = 1
                    this.risky = false
                    cardPossibilities = [0, 0, 0, 0, 100, 200, 300, 400, 500]
                    console.log('not risky')
                }
                this.cards.push({
                    id: i,
                    flipped: false,
                    value: cardPossibilities[Math.floor(Math.random() * cardPossibilities.length)] * multiplier
                })
            }
        },
        flip: function (index) {
            this.cards[index].flipped = !this.cards[index].flipped
            if (this.cards[index].value === 0) {
                // ZONK!!!
                var audio = new Audio('audio/evillaugh.mp3')
                audio.play()
                this.pickNumber = 0
                this.activeTeamPoints = 0
            } else {
                // Card was worth points
                this.activeTeamPoints += this.cards[index].value * this.pickNumber
                if (this.pickNumber === 1) {
                    var audio = new Audio('audio/1_cheer.mp3')
                    audio.play()
                } else if (this.pickNumber === 2) {
                    var audio = new Audio('audio/2_cheer.mp3')
                    audio.play()
                } else {
                    var audio = new Audio('audio/3_cheer.mp3')
                    audio.play()
                }
                this.pickNumber += 1
            }
        },
        reveal: function () {
            var vm = this
            vm.generateCards('notRisky')
            vm.cards.map(function(value) {
                _.delay(function() {
                    value.flipped = !value.flipped
                }, Math.floor(Math.random() * 250) + 40)
            })
            vm.cards.map(function(value) {
                _.delay(function() {
                    value.flipped = !value.flipped
                }, Math.floor(Math.random() * 600) + 400)
            })
        },
        manualReveal: function () {
            var vm = this
            vm.cards.map(function(value) {
                value.flipped = !value.flipped
            })
        },
        restart: function () {
            this.teamOneName = ''
            this.teamOnePoints = 0
            this.teamTwoName = ''
            this.teamTwoPoints = 0
            this.gameOn = false
            this.currentTeam = ''
            this.risky = true
            this.pickNumber = 1
        },
        endTurn: function () {
            this[this.currentTeam] += this.activeTeamPoints
            this.activeTeamPoints = 0
            this.currentTeam = ''
            this.risky = true
            this.pickNumber = 1
            this.generateCards()
        },
        changeTeam: function (num) {
            this.currentTeam = num
            this.risky = true
            this.pickNumber = 1
            this.activeTeamPoints = 0
        }
    },
    mounted() {
        this.generateCards()
        var vm = this
        Mousetrap.bind('e e', function () {
            vm.endTurn()
        })
        Mousetrap.bind('left', function () {
            vm.changeTeam('teamOnePoints')
        })
        Mousetrap.bind('right', function () {
            vm.changeTeam('teamTwoPoints')
        })
        Mousetrap.bind('r r', function () {
            vm.reveal()
        })
        Mousetrap.bind('m r', function () {
            vm.manualReveal()
        })
        Mousetrap.bind(['0 1', '0 2', '0 3', '0 4', '0 5', '0 6', '0 7', '0 8',
                        '0 9', '1 0', '1 1', '1 2', '1 3', '1 4', '1 5', '1 6',
                        '1 7', '1 8', '1 9', '2 0', '2 1', '2 2', '2 3', '2 4'], function(e, combo) {
        var number = Number(combo[0] + combo[2])
        vm.flip(number - 1)

        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
        Mousetrap.bind('s s', function () {
            vm.generateCards()
        })
    }

})

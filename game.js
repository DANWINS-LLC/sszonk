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
        risky: false,
        pickNumber: 1,
        activeTeamPoints: 0,
        cardPossibilities: [0, 0, 0, 0, 100, 200, 300, 400, 500]
    },
    methods: {
        generateCards: function () {
            this.changeTeam()
            this.cards = []
            for (var i = 0; i < _.range(24).length; i++) {
                this.cards.push({
                    id: i,
                    flipped: false,
                    value: this.cardPossibilities[Math.floor(Math.random()*this.cardPossibilities.length)]
                })
            }
        },
        flip: function (index) {
            this.cards[index].flipped = !this.cards[index].flipped
            if (this.cards[index].value === 0) {
                // ZONK!!!
                if (this.risky) {
                    // Subtract points and end turn
                    this[this.currentTeam] -= this.activeTeamPoints
                    this.activeTeamPoints = 0
                } else {
                    // just end turn
                    this.activeTeamPoints = 0
                }
            } else {
                // Card was worth points
                this.activeTeamPoints += this.cards[index].value * this.pickNumber
                this.pickNumber += 1
            }
        },
        reveal: function () {
            var vm = this
            vm.risky = true
            vm.cards.map(function (value) {
                _.delay(function () {
                    value.flipped = !value.flipped
                }, Math.floor(Math.random() * 500) + 0)
            })
            vm.cards.map(function (value) {
                _.delay(function () {
                    value.flipped = !value.flipped
                }, Math.floor(Math.random() * 1000) + 500)
            })
        },
        restart: function () {
            this.teamOneName = ''
            this.teamOnePoints = 0
            this.teamTwoName = ''
            this.teamTwoPoints = 0
            this.gameOn = false
            this.currentTeam = ''
            this.risky = false
            this.pickNumber = 1
        },
        endTurn: function () {
            this[this.currentTeam] += this.activeTeamPoints
            this.activeTeamPoints = 0
            this.currentTeam = ''
            this.risky = false
            this.pickNumber = 1
            this.generateCards()
        },
        changeTeam: function (num) {
            this.currentTeam = num
            this.risky = false
            this.pickNumber = 1
            this.activeTeamPoints = 0
        }
    },
    mounted () {
        this.generateCards()
    }

})

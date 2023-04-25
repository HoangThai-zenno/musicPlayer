const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const cd = $(".cd")
const playbtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
const btnRandom = $(".btn-random")
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    songs: [

        {
            name: "Anh không thể",
            singer: "Mono",
            path: "./assets/music/anhkhongthe_Mono.mp3",
            image: "./assets/images/anh-khong-the.jpg"
        },
        {
            name: "Em là",
            singer: "Mono",
            path: "./assets/music/emla_Mono.mp3",
            image: "./assets/images/Emla.jpg"
        },
        {
            name: "Waitting For You",
            singer: "Mono",
            path: "./assets/music/waittingforyou_Mono.mp3",
            image: "./assets/images/singer.jpg"
        },
        {
            name: "Độ tộc 2",
            singer: "MixiGaming",
            path: "./assets/music/do_toc_2_DoMiXi.mp3",
            image: "./assets/images/dotoc.jpg"
        },
        {
            name: "Lửng lơ",
            singer: "Masew x Bray",
            path: "./assets/music/lung_lo_Masew_Bray.mp3",
            image: "./assets/images/lunglo.jpg"
        },
        {
            name: "Walk on da street",
            singer: "16Typh x 16Brt",
            path: "./assets/music/walk_on_da_street_16_typh_x_16_brt.mp3",
            image: "./assets/images/walkondastreet.jpg"
        },        
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop

            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0
            cd.style.opacity = newCDWidth / cdWidth
        }
        const cdThumbanimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbanimate.pause()
        playbtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
                cdThumbanimate.pause()
            } else {
                audio.play()
                cdThumbanimate.play()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing")
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing")
        }
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        btnNext.onclick = function () {
            if(_this.isRandom){
                _this.randomSong()
            }else{

                _this.nextSong()
            }
            audio.play()
        },
        btnPrev.onclick = function () {
            if(_this.isRandom){
                _this.randomSong()
            }else{

                _this.prevSong()
            }
            audio.play()
        },
        btnRandom.onclick = function () {
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle("active")
        }
        
    },
    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function () {


        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdThumb, audio)
    },
    start: function () {
        this.defineProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    }
}
app.start()
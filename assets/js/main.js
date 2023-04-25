const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const cd = $(".cd")
const playbtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [

        {
            name: "Anh không thể",
            singer: "Mono",
            path: "./assets/music/anhkhongthe_Mono.mp3",
            image: "./assets/images/MONO1.jpg"
        },
        {
            name: "Em là",
            singer: "Mono",
            path: "./assets/music/emla_Mono.mp3",
            image: "./assets/images/singer.jpg"
        },
        {
            name: "Waitting For You",
            singer: "Mono",
            path: "./assets/music/waittingforyou_Mono.mp3",
            image: "./assets/images/singer.jpg"
        }
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
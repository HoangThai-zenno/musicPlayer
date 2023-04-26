const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

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
const btnRepeat = $(".btn-repeat")
const playList = $(".playlist")
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = ${index}>
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
        playList.innerHTML = htmls.join('')
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

        const cdThumbanimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop

            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0
            cd.style.opacity = newCDWidth / cdWidth
        },
            cdThumbanimate.pause(),
            playbtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause()
                    cdThumbanimate.pause()
                } else {
                    audio.play()
                    cdThumbanimate.play()
                }
            },
            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add("playing")
            },
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove("playing")
            },
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            },
            progress.oninput = function (e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            },
            btnNext.onclick = function () {
                _this.isRandom ? _this.randomSong() : _this.nextSong()
                cdThumbanimate.play()
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            },
            btnPrev.onclick = function () {
                _this.isRandom ? _this.randomSong() : _this.prevSong()
                cdThumbanimate.play()
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            },
            btnRandom.onclick = function () {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                btnRandom.classList.toggle("active")
            },
            btnRepeat.onclick = function () {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat', _this.isRepeat)
                btnRepeat.classList.toggle("active")
            },
            audio.onended = function () {
                _this.isRepeat ? audio.play() : btnNext.click()
            },
            playList.onclick = function (e) {
                const songNode = e.target.closest('.song:not(.active)')
                if (songNode || e.target.closest('.option')) {
                    if (songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        cdThumbanimate.play()
                        audio.play()
                    }
                    if (e.target.closest('.option')) {
                        alert("Đang phát triển")
                    }
                }
            }
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
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
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex === 0 || this.currentIndex === 1 || this.currentIndex === 2) {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                })
            } else {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                })
            }
        }, 300);
    },
    repeatSong: function () {
        this.isRepeat ? audio.play() : audio.nextSong()
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        console.log(heading, cdThumb, audio)
    },
    start: function () {
        this.loadConfig()
        this.defineProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
        btnRandom.classList.toggle("active", this.isRandom)
        btnRepeat.classList.toggle("active", this.isRepeat)
    }
}
app.start()
class Sound {

}
/**
 * 音频管理系统
 */
class AudioEngine {
    constructor() {
        this._audioInstances = new Map();
        this._audioContext = null;
        this._audioWebEnabled = false;
        this._audioInstances = new Map();
        this._ismute = false;
        this.initialize();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new AudioEngine();
        }
        return this._instance;
    }
    initialize() {
        try {
            window.AudioContext = window.AudioContext || window["webkitAudioContext"];
            this._audioContext = new AudioContext;
            let t = this;

            function tryToResumeAudioContext() {
                if (t._audioContext.state === "suspended") {
                    t._audioContext.resume();
                } else {
                    clearInterval(resumeInterval);
                }
            }
            let resumeInterval = setInterval(tryToResumeAudioContext, 0.4e3);
            this._audioWebEnabled = true;
        } catch (e) {
            alert("Web Audio API is not supported in this browser");
        }
    }


    pause() {
        this._audioContext.suspend();
    }
    resume() {
        this._audioContext.resume();
    }
    stop(url) {
        if (this._audioInstances.has(url)) {
            const sound = this._audioInstances.get(url);
            const channel = sound.channel;
            if (channel.source.buffer) {
                try {
                    channel.source.stop(this._audioContext.currentTime);
                } catch (e) {
                    channel.source.disconnect();
                }
                channel.source.onended = (function() {});
                channel.setup();
            }
        }
    }
    play(url, loop = false) {
        if (!this._audioWebEnabled)
            return;
        if (this._isPaused) return;
        if (this._audioInstances.has(url)) {
            this.stop(url);
            const sound = this._audioInstances.get(url);
            const channel = sound.channel;
            if (sound.buffer) {
                try {
                    channel.playBuffer(this._audioContext.currentTime, sound.buffer);
                    channel.source.loop = loop;
                } catch (e) {
                    console.error("playBuffer error. Exception: " + e);
                }
            }
        } else {
            this.downloadArrayBuffer(url, () => {
                this.play(url, loop);
            });
        }
    }
    load(urls, onComplete) {
        let t = urls.length;
        let d = 0;
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            this.downloadArrayBuffer(url, () => {
                d++;
                if (d >= t) {
                    onComplete && onComplete();
                }
            });
        }
    }
    setThreeD(url) {
        if (this._audioInstances.has(url)) {
            const sound = this._audioInstances.get(url);
            sound.channel.threeD = true;
        }
    }
    createChannel() {
        let audioContext = this._audioContext;
        let channel = {
            gain: audioContext.createGain(),
            panner: audioContext.createPanner(),
            threeD: false,
            playBuffer: (function(delay, buffer, offset) {
                this.source.buffer = buffer;
                var chan = this;
                this.source.onended = (function() {
                    chan.setup();
                });
                this.source.start(delay, offset);
            }),
            setup: (function() {
                this.source = audioContext.createBufferSource();
                this.setupPanning();
            }),
            setupPanning: (function() {
                if (this.threeD) {
                    this.source.disconnect();
                    this.source.connect(this.panner);
                    this.panner.connect(this.gain);
                } else {
                    this.panner.disconnect();
                    this.source.connect(this.gain);
                }
            })
        };
        channel.panner.rolloffFactor = 0;
        channel.gain.connect(this._audioContext.destination);
        channel.setup();
        return channel;
    }
    downloadArrayBuffer(url, onComplete) {
        if (this._audioInstances.has(url))
            return;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                const sound = new Sound();
                sound.url = url;
                sound.channel = this.createChannel();
                this._audioInstances.set(url, sound);
                this._audioContext.decodeAudioData(xhr.response, (function(buffer) {
                    sound.buffer = buffer;
                    onComplete && onComplete();
                }), (function() {
                    sound.error = true;
                    onComplete && onComplete();
                    console.log("Decode error.");
                }));
            } else {
                throw "no response";
            }
        };
        xhr.onerror = function() {
            onComplete && onComplete();
            throw "no response";
        };
        xhr.ontimeout = function() {
            onComplete && onComplete();
        };
        xhr.onabort = function() {
            onComplete && onComplete();
        };
        xhr.send(null);
    }
}
const AudioEngineInstance = AudioEngine.getInstance();

! function() {
    "use strict";
    var e, t = Laya.ClassUtils.regClass;
    ! function(e) {
        ! function(e) {
            class a extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/ArenaAwardPanel")
                }
            }
            e.ArenaAwardPanelUI = a,
                t("ui.Scene.ArenaAwardPanelUI", a);
            class i extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/ArenaMatePanel")
                }
            }
            e.ArenaMatePanelUI = i,
                t("ui.Scene.ArenaMatePanelUI", i);
            class s extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(s.uiView)
                }
            }
            s.uiView = {
                    type: "Scene",
                    props: {
                        width: 388,
                        height: 112
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 56,
                                x: 194,
                                width: 388,
                                visible: !1,
                                var: "Bg",
                                skin: "Images/ArenaSettle/light_js_player.png",
                                sizeGrid: "27,30,31,37",
                                pivotY: 56,
                                pivotX: 194,
                                name: "",
                                height: 112
                            },
                            compId: 3
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 56.5,
                                x: 70,
                                width: 98,
                                texture: "Images/Settle/toux_dik.png",
                                pivotY: 50,
                                pivotX: 49,
                                height: 99
                            },
                            compId: 6
                        },
                        {
                            type: "Image",
                            props: {
                                y: 55.5,
                                x: 70,
                                width: 85,
                                var: "Icon",
                                pivotY: 43,
                                pivotX: 43,
                                height: 85
                            },
                            compId: 7
                        },
                        {
                            type: "Label",
                            props: {
                                y: 31,
                                x: 233,
                                width: 205,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 11,
                                pivotX: 103,
                                overflow: "hidden",
                                height: 22,
                                fontSize: 22,
                                font: "SimHei",
                                color: "#0fdaff",
                                align: "left"
                            },
                            compId: 10
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 76,
                                x: 142.5,
                                width: 25,
                                texture: "Images/ArenaSettle/icon_jisha.png",
                                pivotY: 16,
                                pivotX: 13,
                                height: 32
                            },
                            compId: 11
                        },
                        {
                            type: "Label",
                            props: {
                                y: 75,
                                x: 186,
                                width: 54,
                                var: "KillLabel",
                                valign: "middle",
                                pivotY: 12,
                                pivotX: 27,
                                height: 24,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "left"
                            },
                            compId: 12
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 75,
                                x: 225,
                                width: 29,
                                texture: "Images/ArenaSettle/icon_die.png",
                                pivotY: 14,
                                pivotX: 15,
                                height: 28
                            },
                            compId: 13
                        },
                        {
                            type: "Label",
                            props: {
                                y: 75,
                                x: 272,
                                width: 54,
                                var: "DileLabel",
                                valign: "middle",
                                pivotY: 12,
                                pivotX: 27,
                                height: 24,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "left"
                            },
                            compId: 14
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 15,
                                x: 70,
                                width: 75,
                                var: "MvpTP",
                                texture: "Images/ArenaSettle/MVP.png",
                                pivotY: 14,
                                pivotX: 38,
                                height: 27
                            },
                            compId: 15
                        }
                    ],
                    loadList: ["Images/ArenaSettle/light_js_player.png", "Images/Settle/toux_dik.png", "Images/ArenaSettle/icon_jisha.png", "Images/ArenaSettle/icon_die.png", "Images/ArenaSettle/MVP.png"],
                    loadList3D: []
                },
                e.ArenaSettleItemUI = s,
                t("ui.Scene.ArenaSettleItemUI", s);
            class n extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/ArenaSettlePanel")
                }
            }
            e.ArenaSettlePanelUI = n,
                t("ui.Scene.ArenaSettlePanelUI", n);
            class o extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/AuthorPanel")
                }
            }
            e.AuthorPanelUI = o,
                t("ui.Scene.AuthorPanelUI", o);
            class r extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/BadgeLvPanel")
                }
            }
            e.BadgeLvPanelUI = r,
                t("ui.Scene.BadgeLvPanelUI", r);
            class l extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/BossBuffPanel")
                }
            }
            e.BossBuffPanelUI = l,
                t("ui.Scene.BossBuffPanelUI", l);
            class h extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/BossSharePanel")
                }
            }
            e.BossSharePanelUI = h,
                t("ui.Scene.BossSharePanelUI", h);
            class c extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/BuffPanel")
                }
            }
            e.BuffPanelUI = c,
                t("ui.Scene.BuffPanelUI", c);
            class d extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(d.uiView)
                }
            }
            d.uiView = {
                    type: "Scene",
                    props: {
                        width: 300,
                        height: 90
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 25,
                                x: 145,
                                width: 300,
                                skin: "Images/Skin/skin.png",
                                sizeGrid: "29,25,16,24",
                                pivotY: 25,
                                pivotX: 145,
                                height: 60
                            },
                            compId: 3
                        },
                        {
                            type: "Label",
                            props: {
                                y: 30,
                                x: 90,
                                width: 160,
                                var: "TipsLabel",
                                valign: "middle",
                                pivotY: 16,
                                pivotX: 80,
                                height: 31,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "left"
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 30,
                                x: 235,
                                width: 114,
                                var: "UpLvBtn",
                                skin: "Images/Settle/btn_yellow.png",
                                pivotY: 24,
                                pivotX: 57,
                                height: 49
                            },
                            compId: 5,
                            child: [{
                                    type: "Sprite",
                                    props: {
                                        y: 20,
                                        x: 57,
                                        width: 58,
                                        var: "sjtp",
                                        texture: "Images/Skin/text_shengji.png",
                                        scaleY: 1,
                                        scaleX: 1,
                                        pivotY: 14,
                                        pivotX: 29,
                                        height: 22
                                    },
                                    compId: 6
                                },
                                {
                                    type: "Sprite",
                                    props: {
                                        y: 20,
                                        x: 57,
                                        width: 75,
                                        var: "ymjtp",
                                        texture: "Images/Skin/text_manji.png",
                                        scaleY: 1,
                                        scaleX: 1,
                                        pivotY: 14,
                                        pivotX: 38,
                                        height: 22
                                    },
                                    compId: 10
                                }
                            ]
                        },
                        {
                            type: "Label",
                            props: {
                                y: 76,
                                x: 207,
                                width: 73,
                                var: "DiamondLabel",
                                valign: "middle",
                                pivotY: 11,
                                pivotX: 37,
                                height: 22,
                                fontSize: 22,
                                font: "Arial",
                                color: "#ffffff",
                                align: "right"
                            },
                            compId: 8
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 76,
                                x: 262,
                                width: 53,
                                var: "zstp",
                                texture: "Images/Start/icon_zs_s.png",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 23,
                                pivotX: 27,
                                height: 46
                            },
                            compId: 9
                        }
                    ],
                    loadList: ["Images/Skin/skin.png", "Images/Settle/btn_yellow.png", "Images/Skin/text_shengji.png", "Images/Skin/text_manji.png", "Images/Start/icon_zs_s.png"],
                    loadList3D: []
                },
                e.DowerItemUI = d,
                t("ui.Scene.DowerItemUI", d);
            class p extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/DowerPanel")
                }
            }
            e.DowerPanelUI = p,
                t("ui.Scene.DowerPanelUI", p);
            class m extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(m.uiView)
                }
            }
            m.uiView = {
                    type: "Scene",
                    props: {
                        y: 60,
                        x: 60,
                        width: 128,
                        pivotY: 60,
                        pivotX: 60,
                        height: 128
                    },
                    compId: 2,
                    child: [{
                            type: "Sprite",
                            props: {
                                y: 64,
                                x: 64,
                                width: 128,
                                texture: "Images/Start/biank.png",
                                pivotY: 64,
                                pivotX: 64,
                                height: 128
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 64,
                                x: 64,
                                width: 120,
                                var: "Icon",
                                pivotY: 60,
                                pivotX: 60,
                                height: 120
                            },
                            compId: 3
                        }
                    ],
                    loadList: ["Images/Start/biank.png"],
                    loadList3D: []
                },
                e.ExportItemUI = m,
                t("ui.Scene.ExportItemUI", m);
            class y extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(y.uiView)
                }
            }
            y.uiView = {
                    type: "Scene",
                    props: {
                        width: 262,
                        height: 50
                    },
                    compId: 2,
                    child: [{
                            type: "Sprite",
                            props: {
                                y: 25,
                                x: 131,
                                width: 262,
                                var: "Bg",
                                texture: "Images/Game/light_player.png",
                                pivotY: 25,
                                pivotX: 131,
                                height: 50
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 26,
                                x: 32,
                                width: 62,
                                var: "RankIcon",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 43,
                                pivotX: 31,
                                height: 85
                            },
                            compId: 4
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 25,
                                x: 82,
                                width: 98,
                                var: "kuangbg",
                                texture: "Images/Settle/toux_dik.png",
                                scaleY: .45,
                                scaleX: .45,
                                pivotY: 50,
                                pivotX: 49,
                                height: 99
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                y: 24.5,
                                x: 82,
                                width: 100,
                                var: "Icon",
                                skin: "comp/image.png",
                                scaleY: .4,
                                scaleX: .4,
                                pivotY: 50,
                                pivotX: 50,
                                height: 100
                            },
                            compId: 6
                        },
                        {
                            type: "Image",
                            props: {
                                y: 24.5,
                                x: 82,
                                width: 150,
                                var: "BadgeIcon",
                                scaleY: .3,
                                scaleX: .3,
                                pivotY: 75,
                                pivotX: 75,
                                height: 150
                            },
                            compId: 8
                        },
                        {
                            type: "Text",
                            props: {
                                y: 39,
                                x: 83.5,
                                width: 55,
                                var: "BadgeLabel",
                                valign: "middle",
                                strokeColor: "#000000",
                                stroke: 2,
                                pivotY: 11,
                                pivotX: 28,
                                height: 22,
                                fontSize: 12,
                                font: "Microsoft YaHei",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 10
                        },
                        {
                            type: "Label",
                            props: {
                                y: 25,
                                x: 160,
                                width: 96,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 13,
                                pivotX: 48,
                                overflow: "hidden",
                                height: 26,
                                fontSize: 16,
                                font: "SimHei",
                                color: "#F0F7FF",
                                align: "left"
                            },
                            compId: 7
                        },
                        {
                            type: "Label",
                            props: {
                                y: 25,
                                x: 238,
                                width: 35,
                                var: "KillLabel",
                                valign: "middle",
                                pivotY: 13,
                                pivotX: 18,
                                height: 26,
                                fontSize: 16,
                                font: "Arial",
                                color: "#F0F7FF",
                                align: "center"
                            },
                            compId: 9
                        }
                    ],
                    loadList: ["Images/Game/light_player.png", "Images/Settle/toux_dik.png", "comp/image.png"],
                    loadList3D: []
                },
                e.GameItemUI = y,
                t("ui.Scene.GameItemUI", y);
            class f extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/GamePanel")
                }
            }
            e.GamePanelUI = f,
                t("ui.Scene.GamePanelUI", f);
            class S extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/GetAwardPanel")
                }
            }
            e.GetAwardPanelUI = S,
                t("ui.Scene.GetAwardPanelUI", S);
            class L extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/LoadingPanel")
                }
            }
            e.LoadingPanelUI = L,
                t("ui.Scene.LoadingPanelUI", L);
            class v extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/LotteryPanel")
                }
            }
            e.LotteryPanelUI = v,
                t("ui.Scene.LotteryPanelUI", v);
            class I extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(I.uiView)
                }
            }
            I.uiView = {
                    type: "Scene",
                    props: {
                        width: 240,
                        height: 120
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 240,
                                visible: !1,
                                var: "Bg1",
                                skin: "Images/Arena/huangse_dik.png",
                                sizeGrid: "27,30,31,37",
                                name: "",
                                height: 120
                            },
                            compId: 9
                        },
                        {
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 240,
                                visible: !1,
                                var: "Bg2",
                                skin: "Images/Arena/lanse_dik.png",
                                sizeGrid: "27,30,31,37",
                                name: "",
                                height: 120
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 240,
                                visible: !1,
                                var: "Bg3",
                                skin: "Images/Arena/hongse_dk.png",
                                sizeGrid: "27,30,31,37",
                                name: "",
                                height: 120
                            },
                            compId: 10
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 60,
                                x: 60,
                                width: 98,
                                texture: "Images/Settle/toux_dik.png",
                                pivotY: 50,
                                pivotX: 49,
                                height: 99
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 59,
                                x: 60.5,
                                width: 85,
                                var: "Icon",
                                pivotY: 43,
                                pivotX: 43,
                                height: 85
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                y: 40.5,
                                x: 141.5,
                                width: 150,
                                var: "BadgeIcon",
                                scaleY: .4,
                                scaleX: .4,
                                pivotY: 75,
                                pivotX: 75,
                                height: 150
                            },
                            compId: 6
                        },
                        {
                            type: "Text",
                            props: {
                                y: 44,
                                x: 199,
                                width: 60,
                                var: "BadgeLabel",
                                valign: "middle",
                                strokeColor: "#1A140F",
                                stroke: 2,
                                pivotY: 12,
                                pivotX: 30,
                                height: 23,
                                fontSize: 17,
                                font: "SimHei",
                                color: "#F0F7FF",
                                align: "left",
                                runtime: "laya.display.Text"
                            },
                            compId: 7
                        },
                        {
                            type: "Label",
                            props: {
                                y: 87.5,
                                x: 174,
                                width: 120,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 11,
                                pivotX: 60,
                                overflow: "hidden",
                                height: 22,
                                fontSize: 22,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center"
                            },
                            compId: 8
                        }
                    ],
                    loadList: ["Images/Arena/huangse_dik.png", "Images/Arena/lanse_dik.png", "Images/Arena/hongse_dk.png", "Images/Settle/toux_dik.png"],
                    loadList3D: []
                },
                e.MateItemUI = I,
                t("ui.Scene.MateItemUI", I);
            class w extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/MFSkinPanel")
                }
            }
            e.MFSkinPanelUI = w,
                t("ui.Scene.MFSkinPanelUI", w);
            class u extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(u.uiView)
                }
            }
            u.uiView = {
                    type: "Scene",
                    props: {
                        y: 67,
                        x: 55,
                        width: 110,
                        pivotY: 67.5,
                        pivotX: 55,
                        height: 145
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 68,
                                x: 55,
                                width: 110,
                                skin: "Images/Start/dik2.png",
                                sizeGrid: "30,30,34,35",
                                pivotY: 68,
                                pivotX: 55,
                                height: 145
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                y: 55,
                                x: 55,
                                width: 110,
                                var: "MiniGameIcon",
                                pivotY: 55,
                                pivotX: 55,
                                height: 110
                            },
                            compId: 3
                        },
                        {
                            type: "Label",
                            props: {
                                y: 124,
                                x: 55,
                                width: 110,
                                var: "MiniGameLabel",
                                valign: "middle",
                                pivotY: 10,
                                pivotX: 55,
                                overflow: "hidden",
                                height: 20,
                                fontSize: 18,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center"
                            },
                            compId: 4
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 17,
                                x: 96.5,
                                width: 27,
                                visible: !1,
                                var: "HDTP",
                                texture: "Images/Start/red.png",
                                pivotY: 16,
                                pivotX: 14,
                                height: 31
                            },
                            compId: 6
                        }
                    ],
                    loadList: ["Images/Start/dik2.png", "Images/Start/red.png"],
                    loadList3D: []
                },
                e.MiniGameItemUI = u,
                t("ui.Scene.MiniGameItemUI", u);
            class g extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(g.uiView)
                }
            }
            g.uiView = {
                    type: "Scene",
                    props: {
                        y: 75,
                        x: 75,
                        width: 158,
                        pivotY: 75,
                        pivotX: 75,
                        height: 158
                    },
                    compId: 2,
                    child: [{
                            type: "Sprite",
                            props: {
                                y: 79,
                                x: 79,
                                width: 158,
                                texture: "Images/Start/biank.png",
                                pivotY: 79,
                                pivotX: 79,
                                height: 158
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 79,
                                x: 79,
                                width: 150,
                                var: "Icon",
                                pivotY: 75,
                                pivotX: 75,
                                height: 150
                            },
                            compId: 3
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 19,
                                x: 142.5,
                                width: 27,
                                visible: !1,
                                var: "HDTP",
                                texture: "Images/Start/red.png",
                                scaleY: 1.2,
                                scaleX: 1.2,
                                pivotY: 16,
                                pivotX: 14,
                                height: 31
                            },
                            compId: 5
                        }
                    ],
                    loadList: ["Images/Start/biank.png", "Images/Start/red.png"],
                    loadList3D: []
                },
                e.OverExportItemUI = g,
                t("ui.Scene.OverExportItemUI", g);
            class k extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/OverExportPanel")
                }
            }
            e.OverExportPanelUI = k,
                t("ui.Scene.OverExportPanelUI", k);
            class b extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/OverPanel")
                }
            }
            e.OverPanelUI = b,
                t("ui.Scene.OverPanelUI", b);
            class B extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(B.uiView)
                }
            }
            B.uiView = {
                    type: "Scene",
                    props: {
                        width: 660,
                        height: 130
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                width: 660,
                                visible: !1,
                                var: "Bg1",
                                skin: "Images/Rank/phb_dik3.png",
                                sizeGrid: "27,30,34,30",
                                height: 130
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 660,
                                visible: !1,
                                var: "Bg2",
                                skin: "Images/Rank/phb_dik2.png",
                                sizeGrid: "27,30,34,30",
                                height: 130
                            },
                            compId: 16
                        },
                        {
                            type: "Image",
                            props: {
                                y: 65,
                                x: 52,
                                width: 62,
                                var: "RankIcon",
                                pivotY: 43,
                                pivotX: 31,
                                height: 85
                            },
                            compId: 4
                        },
                        {
                            type: "Label",
                            props: {
                                y: 66,
                                x: 52,
                                width: 99,
                                var: "RankLabel",
                                valign: "middle",
                                pivotY: 54,
                                pivotX: 50,
                                height: 108,
                                fontSize: 50,
                                font: "Arial",
                                color: "#0E60A5",
                                align: "center"
                            },
                            compId: 5
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 63,
                                x: 164,
                                width: 98,
                                texture: "Images/Settle/toux_dik.png",
                                pivotY: 50,
                                pivotX: 49,
                                height: 99
                            },
                            compId: 6
                        },
                        {
                            type: "Image",
                            props: {
                                y: 62,
                                x: 164.5,
                                width: 85,
                                var: "Icon",
                                pivotY: 43,
                                pivotX: 43,
                                height: 85
                            },
                            compId: 7
                        },
                        {
                            type: "Label",
                            props: {
                                y: 65,
                                x: 320,
                                width: 180,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 15,
                                pivotX: 90,
                                overflow: "hidden",
                                height: 30,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#000000",
                                align: "left"
                            },
                            compId: 8
                        },
                        {
                            type: "Image",
                            props: {
                                y: 62,
                                x: 464,
                                width: 150,
                                var: "BadgeIcon",
                                scaleY: .6,
                                scaleX: .6,
                                pivotY: 75,
                                pivotX: 75,
                                height: 150
                            },
                            compId: 9
                        },
                        {
                            type: "Text",
                            props: {
                                y: 91,
                                x: 466,
                                width: 81,
                                var: "BadgeLabel",
                                valign: "middle",
                                strokeColor: "#0C0B0B",
                                stroke: 2,
                                pivotY: 14,
                                pivotX: 41,
                                height: 28,
                                fontSize: 20,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 14
                        },
                        {
                            type: "Label",
                            props: {
                                y: 65,
                                x: 574,
                                width: 100,
                                var: "LevelLabel",
                                valign: "middle",
                                pivotY: 17,
                                pivotX: 50,
                                height: 33,
                                fontSize: 33,
                                font: "SimHei",
                                color: "#FF7F02",
                                align: "right"
                            },
                            compId: 15
                        }
                    ],
                    loadList: ["Images/Rank/phb_dik3.png", "Images/Rank/phb_dik2.png", "Images/Settle/toux_dik.png"],
                    loadList3D: []
                },
                e.RankItemUI = B,
                t("ui.Scene.RankItemUI", B);
            class x extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/RankPanel")
                }
            }
            e.RankPanelUI = x,
                t("ui.Scene.RankPanelUI", x);
            class T extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/RecommendPanel")
                }
            }
            e.RecommendPanelUI = T,
                t("ui.Scene.RecommendPanelUI", T);
            class C extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SetPanel")
                }
            }
            e.SetPanelUI = C,
                t("ui.Scene.SetPanelUI", C);
            class D extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(D.uiView)
                }
            }
            D.uiView = {
                    type: "Scene",
                    props: {
                        y: 117,
                        x: 100,
                        width: 200,
                        pivotY: 117,
                        pivotX: 100,
                        height: 245
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 200,
                                skin: "Images/Start/dik2.png",
                                sizeGrid: "35,33,35,39",
                                height: 245
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                width: 200,
                                var: "Icon",
                                height: 200
                            },
                            compId: 3
                        },
                        {
                            type: "Label",
                            props: {
                                y: 219,
                                x: 100,
                                width: 200,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 15,
                                pivotX: 100,
                                overflow: "hidden",
                                height: 30,
                                fontSize: 30,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center"
                            },
                            compId: 4
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 24,
                                x: 180,
                                width: 27,
                                visible: !1,
                                var: "HDTP",
                                texture: "Images/Start/red.png",
                                scaleY: 1.5,
                                scaleX: 1.5,
                                pivotY: 16,
                                pivotX: 14,
                                height: 31
                            },
                            compId: 6
                        }
                    ],
                    loadList: ["Images/Start/dik2.png", "Images/Start/red.png"],
                    loadList3D: []
                },
                e.SettleExportItemUI = D,
                t("ui.Scene.SettleExportItemUI", D);
            class M extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SettleExportPanel")
                }
            }
            e.SettleExportPanelUI = M,
                t("ui.Scene.SettleExportPanelUI", M);
            class P extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(P.uiView)
                }
            }
            P.uiView = {
                    type: "Scene",
                    props: {
                        y: 57,
                        x: 375,
                        width: 750,
                        pivotY: 57,
                        pivotX: 375,
                        height: 114
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 57,
                                x: 375,
                                width: 680,
                                var: "Bg1",
                                skin: "Images/Settle/jiesuan_dik1.png",
                                sizeGrid: "0,35,0,152",
                                pivotY: 57,
                                pivotX: 340,
                                height: 114
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 57,
                                x: 375,
                                width: 680,
                                var: "Bg2",
                                skin: "Images/Settle/jiesuan_dik2.png",
                                sizeGrid: "0,35,0,152",
                                pivotY: 57,
                                pivotX: 340,
                                height: 114
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 57,
                                x: 83,
                                width: 62,
                                var: "RankIcon",
                                pivotY: 43,
                                pivotX: 31,
                                height: 85
                            },
                            compId: 5
                        },
                        {
                            type: "Label",
                            props: {
                                y: 57,
                                x: 83,
                                width: 66,
                                var: "RankLabel",
                                valign: "middle",
                                pivotY: 40,
                                pivotX: 33,
                                height: 79,
                                fontSize: 50,
                                font: "Arial",
                                color: "#ffffff",
                                align: "center"
                            },
                            compId: 6
                        },
                        {
                            type: "Image",
                            props: {
                                y: 50,
                                x: 191,
                                width: 150,
                                var: "BadgeIcon",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 75,
                                pivotX: 75,
                                height: 150
                            },
                            compId: 7
                        },
                        {
                            type: "Text",
                            props: {
                                y: 74,
                                x: 191,
                                width: 81,
                                var: "BadgeLabel",
                                valign: "middle",
                                strokeColor: "#000000",
                                stroke: 2,
                                pivotY: 14,
                                pivotX: 41,
                                height: 28,
                                fontSize: 20,
                                font: "Microsoft YaHei",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 8
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 55,
                                x: 282,
                                width: 98,
                                var: "zz",
                                texture: "Images/Settle/toux_dik.png",
                                pivotY: 50,
                                pivotX: 49,
                                height: 99
                            },
                            compId: 11
                        },
                        {
                            type: "Image",
                            props: {
                                y: 54,
                                x: 282.5,
                                width: 87,
                                var: "Icon",
                                pivotY: 44,
                                pivotX: 44,
                                height: 87
                            },
                            compId: 10
                        },
                        {
                            type: "Label",
                            props: {
                                y: 56,
                                x: 426,
                                width: 156,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 13,
                                pivotX: 78,
                                overflow: "hidden",
                                height: 26,
                                fontSize: 22,
                                font: "SimHei",
                                color: "#000000",
                                align: "left"
                            },
                            compId: 9
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 53,
                                x: 536,
                                width: 92,
                                texture: "Images/Settle/icon_exp.png",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 46,
                                pivotX: 46,
                                height: 91
                            },
                            compId: 12
                        },
                        {
                            type: "Label",
                            props: {
                                y: 55,
                                x: 618,
                                width: 105,
                                var: "ExpLabel",
                                valign: "middle",
                                pivotY: 15,
                                pivotX: 53,
                                overflow: "hidden",
                                height: 30,
                                fontSize: 32,
                                font: "Arial",
                                color: "#FF7505",
                                align: "left"
                            },
                            compId: 13
                        }
                    ],
                    loadList: ["Images/Settle/jiesuan_dik1.png", "Images/Settle/jiesuan_dik2.png", "Images/Settle/toux_dik.png", "Images/Settle/icon_exp.png"],
                    loadList3D: []
                },
                e.SettleItemUI = P,
                t("ui.Scene.SettleItemUI", P);
            class _ extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SettleLotteryPanel")
                }
            }
            e.SettleLotteryPanelUI = _,
                t("ui.Scene.SettleLotteryPanelUI", _);
            class A extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SettlePanel")
                }
            }
            e.SettlePanelUI = A,
                t("ui.Scene.SettlePanelUI", A);
            class E extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SettleSharePanel")
                }
            }
            e.SettleSharePanelUI = E,
                t("ui.Scene.SettleSharePanelUI", E);
            class G extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(G.uiView)
                }
            }
            G.uiView = {
                    type: "Scene",
                    props: {
                        width: 654,
                        height: 195
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 98,
                                x: 104,
                                width: 208,
                                visible: !1,
                                var: "bg1",
                                skin: "Images/Sign/qiand_dik_b.png",
                                sizeGrid: "64,68,71,59",
                                pivotY: 98,
                                pivotX: 104,
                                height: 195
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 99,
                                x: 327,
                                width: 426,
                                visible: !1,
                                var: "bg2",
                                skin: "Images/Sign/qiand_dik_p.png",
                                sizeGrid: "0,72,0,65",
                                pivotY: 98,
                                pivotX: 213,
                                height: 195
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                y: 99,
                                x: 104,
                                width: 208,
                                visible: !1,
                                var: "bg3",
                                skin: "Images/Sign/qiand_dik_y.png",
                                pivotY: 98,
                                pivotX: 104,
                                height: 195
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 99,
                                x: 327,
                                width: 426,
                                visible: !1,
                                var: "bg4",
                                skin: "Images/Sign/qiand_dik_y.png",
                                sizeGrid: "0,72,0,65",
                                pivotY: 98,
                                pivotX: 213,
                                height: 195
                            },
                            compId: 7
                        },
                        {
                            type: "Image",
                            props: {
                                y: 49,
                                x: 43,
                                width: 85,
                                visible: !1,
                                var: "daytp",
                                pivotY: 48,
                                pivotX: 43,
                                height: 95
                            },
                            compId: 8
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 90,
                                x: 47,
                                width: 116,
                                visible: !1,
                                var: "jbtp",
                                texture: "Images/Settle/icon_jindi2.png",
                                scaleY: .7,
                                scaleX: .7,
                                pivotY: 48,
                                pivotX: 58,
                                height: 96
                            },
                            compId: 9
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 95,
                                x: 156,
                                width: 40,
                                visible: !1,
                                var: "tltp",
                                texture: "Images/Start/icon_oilbottle.png",
                                scaleY: 1.5,
                                scaleX: 1.5,
                                pivotY: 27,
                                pivotX: 20,
                                height: 53
                            },
                            compId: 10
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 85,
                                x: 151,
                                width: 142,
                                visible: !1,
                                var: "zstp",
                                texture: "Images/Start/icon_zuans.png",
                                scaleY: .7,
                                scaleX: .7,
                                pivotY: 52,
                                pivotX: 71,
                                height: 104
                            },
                            compId: 19
                        },
                        {
                            type: "Image",
                            props: {
                                y: 90,
                                x: 151,
                                width: 88,
                                visible: !1,
                                var: "sptp",
                                skin: "Images/SkinShop/Debris/suip_kedou.png",
                                scaleY: .7,
                                scaleX: .7,
                                pivotY: 44,
                                pivotX: 44,
                                height: 88
                            },
                            compId: 11
                        },
                        {
                            type: "Image",
                            props: {
                                y: 88,
                                x: 446,
                                width: 221,
                                visible: !1,
                                var: "jstp",
                                skin: "Images/SkinShop/skinShow/shizi.png",
                                scaleY: .4,
                                scaleX: .4,
                                pivotY: 121,
                                pivotX: 111,
                                height: 242
                            },
                            compId: 12
                        },
                        {
                            type: "Text",
                            props: {
                                y: 152,
                                x: 47,
                                width: 104,
                                visible: !1,
                                var: "goldlabel",
                                valign: "middle",
                                strokeColor: "#030202",
                                stroke: 3,
                                pivotY: 18,
                                pivotX: 52,
                                height: 35,
                                fontSize: 30,
                                font: "Arial",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 13
                        },
                        {
                            type: "Text",
                            props: {
                                y: 152,
                                x: 151,
                                width: 104,
                                visible: !1,
                                var: "diamondlabel",
                                valign: "middle",
                                strokeColor: "#030202",
                                stroke: 3,
                                pivotY: 18,
                                pivotX: 52,
                                height: 35,
                                fontSize: 30,
                                font: "Arial",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 18
                        },
                        {
                            type: "Text",
                            props: {
                                y: 152,
                                x: 151,
                                width: 104,
                                visible: !1,
                                var: "proplabel",
                                valign: "middle",
                                strokeColor: "#030202",
                                stroke: 3,
                                pivotY: 18,
                                pivotX: 52,
                                height: 35,
                                fontSize: 30,
                                font: "Arial",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 14
                        },
                        {
                            type: "Image",
                            props: {
                                y: 100,
                                x: 104,
                                width: 208,
                                visible: !1,
                                var: "zz1",
                                skin: "Images/Sign/ylq_dis.png",
                                sizeGrid: "14,29,25,17",
                                pivotY: 98,
                                pivotX: 104,
                                height: 195
                            },
                            compId: 15
                        },
                        {
                            type: "Image",
                            props: {
                                y: 99,
                                x: 327,
                                width: 426,
                                visible: !1,
                                var: "zz2",
                                skin: "Images/Sign/ylq_dis.png",
                                sizeGrid: "14,29,25,17",
                                pivotY: 98,
                                pivotX: 213,
                                height: 195
                            },
                            compId: 16
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 100,
                                x: 100,
                                width: 94,
                                visible: !1,
                                var: "lyqtp",
                                texture: "Images/Sign/lab_ylq.png",
                                pivotY: 64,
                                pivotX: 47,
                                height: 127
                            },
                            compId: 17
                        }
                    ],
                    loadList: ["Images/Sign/qiand_dik_b.png", "Images/Sign/qiand_dik_p.png", "Images/Sign/qiand_dik_y.png", "Images/Settle/icon_jindi2.png", "Images/Start/icon_oilbottle.png", "Images/Start/icon_zuans.png", "Images/SkinShop/Debris/suip_kedou.png", "Images/SkinShop/skinShow/shizi.png", "Images/Sign/ylq_dis.png", "Images/Sign/lab_ylq.png"],
                    loadList3D: []
                },
                e.SignItemUI = G,
                t("ui.Scene.SignItemUI", G);
            class R extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SignPanel")
                }
            }
            e.SignPanelUI = R,
                t("ui.Scene.SignPanelUI", R);
            class V extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(V.uiView)
                }
            }
            V.uiView = {
                    type: "Scene",
                    props: {
                        width: 76,
                        height: 73
                    },
                    compId: 2,
                    child: [{
                        type: "Image",
                        props: {
                            y: 37,
                            x: 38,
                            width: 76,
                            var: "ColorIcon",
                            pivotY: 37,
                            pivotX: 38,
                            height: 73
                        },
                        compId: 4,
                        child: [{
                                type: "Sprite",
                                props: {
                                    y: 48,
                                    x: 53,
                                    var: "VideoTP",
                                    texture: "Images/Start/icon_sp.png",
                                    scaleY: .5,
                                    scaleX: .5
                                },
                                compId: 5
                            },
                            {
                                type: "Sprite",
                                props: {
                                    y: 36.5,
                                    x: 38,
                                    width: 49,
                                    var: "UserTP",
                                    texture: "Images/Skin/tick.png",
                                    pivotY: 22,
                                    pivotX: 25,
                                    height: 44
                                },
                                compId: 6
                            }
                        ]
                    }],
                    loadList: ["Images/Start/icon_sp.png", "Images/Skin/tick.png"],
                    loadList3D: []
                },
                e.SkinColorItemUI = V,
                t("ui.Scene.SkinColorItemUI", V);
            class H extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(H.uiView)
                }
            }
            H.uiView = {
                    type: "Scene",
                    props: {
                        width: 210,
                        height: 315
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 0,
                                x: 0,
                                width: 210,
                                skin: "Images/SkinShop/jues_dik.png",
                                height: 260
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 130,
                                x: 104.5,
                                width: 221,
                                var: "SkinIcon",
                                scaleY: .94,
                                scaleX: .94,
                                pivotY: 121,
                                pivotX: 111,
                                height: 242
                            },
                            compId: 5
                        },
                        {
                            type: "Image",
                            props: {
                                y: 231,
                                x: 104,
                                width: 210,
                                skin: "Images/SkinShop/name_dik.png",
                                sizeGrid: "0,31,0,31",
                                pivotY: 24,
                                pivotX: 105,
                                height: 48
                            },
                            compId: 7
                        },
                        {
                            type: "Text",
                            props: {
                                y: 230,
                                x: 105,
                                width: 210,
                                var: "SkinNameLabel",
                                valign: "middle",
                                strokeColor: "#0A0302",
                                stroke: 2,
                                pivotY: 14,
                                pivotX: 105,
                                height: 28,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 11
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 22,
                                x: 72,
                                width: 143,
                                var: "jbbg",
                                texture: "Images/SkinShop/jiage_di.png",
                                pivotY: 22,
                                pivotX: 72,
                                height: 43
                            },
                            compId: 8
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 20,
                                x: 20,
                                width: 50,
                                var: "jbtp",
                                texture: "Images/Start/icon_jinbi.png",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 27,
                                pivotX: 25,
                                height: 53
                            },
                            compId: 9
                        },
                        {
                            type: "Label",
                            props: {
                                y: 20,
                                x: 84,
                                width: 94,
                                var: "GoldLabel",
                                valign: "middle",
                                pivotY: 12,
                                pivotX: 47,
                                height: 24,
                                fontSize: 24,
                                font: "Arial",
                                color: "#ffffff",
                                align: "left"
                            },
                            compId: 10
                        },
                        {
                            type: "Image",
                            props: {
                                y: 288.5,
                                x: 105,
                                width: 137,
                                var: "BuyBtn",
                                skin: "Images/Settle/btn_yellow.png",
                                pivotY: 28,
                                pivotX: 69,
                                height: 55
                            },
                            compId: 13,
                            child: [{
                                    type: "Sprite",
                                    props: {
                                        y: 27.5,
                                        x: 68.5,
                                        width: 62,
                                        var: "gmtp",
                                        texture: "Images/SkinShop/text_goumai.png",
                                        scaleY: 1,
                                        scaleX: 1,
                                        pivotY: 15,
                                        pivotX: 31,
                                        height: 15
                                    },
                                    compId: 14
                                },
                                {
                                    type: "Sprite",
                                    props: {
                                        y: 27.5,
                                        x: 35,
                                        width: 47,
                                        visible: !1,
                                        var: "videotp",
                                        texture: "Images/Start/icon_sp.png",
                                        scaleY: .8,
                                        scaleX: .8,
                                        pivotY: 24,
                                        pivotX: 24,
                                        height: 47
                                    },
                                    compId: 15
                                }
                            ]
                        }
                    ],
                    loadList: ["Images/SkinShop/jues_dik.png", "Images/SkinShop/name_dik.png", "Images/SkinShop/jiage_di.png", "Images/Start/icon_jinbi.png", "Images/Settle/btn_yellow.png", "Images/SkinShop/text_goumai.png", "Images/Start/icon_sp.png"],
                    loadList3D: []
                },
                e.SkinGoldItemUI = H,
                t("ui.Scene.SkinGoldItemUI", H);
            class O extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(O.uiView)
                }
            }
            O.uiView = {
                    type: "Scene",
                    props: {
                        width: 656,
                        height: 242
                    },
                    compId: 2,
                    child: [{
                        type: "Image",
                        props: {
                            y: 121,
                            x: 328,
                            width: 221,
                            var: "SkinIcon",
                            pivotY: 121,
                            pivotX: 111,
                            height: 242
                        },
                        compId: 3
                    }],
                    loadList: [],
                    loadList3D: []
                },
                e.SkinItemUI = O,
                t("ui.Scene.SkinItemUI", O);
            class U extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SkinPanel")
                }
            }
            e.SkinPanelUI = U,
                t("ui.Scene.SkinPanelUI", U);
            class N extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/SkinShopPanel")
                }
            }
            e.SkinShopPanelUI = N,
                t("ui.Scene.SkinShopPanelUI", N);
            class z extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(z.uiView)
                }
            }
            z.uiView = {
                    type: "Scene",
                    props: {
                        width: 235,
                        height: 245
                    },
                    compId: 2,
                    child: [{
                            type: "Sprite",
                            props: {
                                y: 11,
                                x: 13.5,
                                width: 210,
                                texture: "Images/SkinShop/jues_dik.png",
                                name: "",
                                height: 225
                            },
                            compId: 3
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 31,
                                x: 118,
                                width: 80,
                                var: "yhdtp",
                                texture: "Images/SkinShop/lab_yhd.png",
                                pivotY: 16,
                                pivotX: 40,
                                name: "",
                                height: 31
                            },
                            compId: 4
                        },
                        {
                            type: "Image",
                            props: {
                                y: 138,
                                x: 117,
                                width: 221,
                                var: "SkinIcon",
                                skin: "Images/SkinShop/ycpi/haitun.png",
                                scaleY: .85,
                                scaleX: .85,
                                pivotY: 121,
                                pivotX: 111,
                                name: "",
                                height: 242
                            },
                            compId: 10,
                            child: [{
                                type: "Image",
                                props: {
                                    y: 121,
                                    x: 111,
                                    width: 221,
                                    var: "NeiQuan",
                                    scaleY: 1,
                                    pivotY: 121,
                                    pivotX: 111,
                                    name: "",
                                    height: 242
                                },
                                compId: 21
                            }]
                        },
                        {
                            type: "Image",
                            props: {
                                y: 31,
                                x: 118,
                                width: 210,
                                var: "sptp",
                                skin: "Images/Start/jindi_dik.png",
                                sizeGrid: "0,33,0,25",
                                pivotY: 20,
                                pivotX: 105,
                                name: "",
                                height: 40
                            },
                            compId: 5,
                            child: [{
                                    type: "Image",
                                    props: {
                                        y: 20,
                                        x: 0,
                                        width: 0,
                                        var: "spjdtp",
                                        skin: "Images/Start/jindu_blue.png",
                                        sizeGrid: "0,15,0,15",
                                        pivotY: 20,
                                        height: 40
                                    },
                                    compId: 6
                                },
                                {
                                    type: "Sprite",
                                    props: {
                                        y: 16.5,
                                        x: 15,
                                        width: 86,
                                        texture: "Images/Start/suip11.png",
                                        scaleY: .6,
                                        scaleX: .6,
                                        pivotY: 45,
                                        pivotX: 43,
                                        height: 89
                                    },
                                    compId: 7
                                },
                                {
                                    type: "Label",
                                    props: {
                                        y: 20,
                                        x: 105,
                                        width: 71,
                                        var: "splabel",
                                        valign: "middle",
                                        pivotY: 13,
                                        pivotX: 36,
                                        height: 26,
                                        fontSize: 26,
                                        font: "Arial",
                                        color: "#ffffff",
                                        align: "center"
                                    },
                                    compId: 14
                                }
                            ]
                        },
                        {
                            type: "Image",
                            props: {
                                y: 211,
                                x: 117,
                                width: 210,
                                skin: "Images/SkinShop/name_dik.png",
                                sizeGrid: "0,31,0,31",
                                pivotY: 24,
                                pivotX: 105,
                                name: "",
                                height: 48
                            },
                            compId: 11
                        },
                        {
                            type: "Text",
                            props: {
                                y: 210,
                                x: 118,
                                width: 210,
                                var: "SkinNameLabel",
                                valign: "middle",
                                strokeColor: "#0A0302",
                                stroke: 2,
                                pivotY: 14,
                                pivotX: 105,
                                height: 28,
                                fontSize: 24,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "center",
                                runtime: "laya.display.Text"
                            },
                            compId: 12
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 123,
                                x: 117,
                                width: 230,
                                visible: !1,
                                texture: "Images/SkinShop/chouqu_light.png",
                                pivotY: 121,
                                pivotX: 115,
                                name: "Kuang",
                                height: 242
                            },
                            compId: 13
                        }
                    ],
                    loadList: ["Images/SkinShop/jues_dik.png", "Images/SkinShop/lab_yhd.png", "Images/SkinShop/ycpi/haitun.png", "Images/Start/jindi_dik.png", "Images/Start/jindu_blue.png", "Images/Start/suip11.png", "Images/SkinShop/name_dik.png", "Images/SkinShop/chouqu_light.png"],
                    loadList3D: []
                },
                e.SkinVideoItemUI = z,
                t("ui.Scene.SkinVideoItemUI", z);
            class F extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(F.uiView)
                }
            }
            F.uiView = {
                    type: "Scene",
                    props: {
                        width: 630,
                        height: 100
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 50,
                                x: 315,
                                width: 630,
                                skin: "Images/Skin/skin.png",
                                sizeGrid: "29,25,16,24",
                                pivotY: 50,
                                pivotX: 315,
                                height: 100
                            },
                            compId: 3
                        },
                        {
                            type: "Label",
                            props: {
                                y: 50,
                                x: 175,
                                width: 289,
                                var: "TipsLabel",
                                valign: "middle",
                                pivotY: 18,
                                pivotX: 145,
                                height: 35,
                                fontSize: 35,
                                font: "SimHei",
                                color: "#ffffff",
                                align: "left"
                            },
                            compId: 4,
                            child: [{
                                type: "Sprite",
                                props: {
                                    y: 17.5,
                                    x: 273,
                                    width: 40,
                                    visible: !1,
                                    var: "jttp",
                                    texture: "Images/Skin/jiantou.png",
                                    pivotY: 15,
                                    pivotX: 20,
                                    height: 29
                                },
                                compId: 10
                            }]
                        },
                        {
                            type: "Label",
                            props: {
                                y: 50,
                                x: 412,
                                width: 109,
                                visible: !1,
                                var: "NextlvLabel",
                                valign: "middle",
                                pivotY: 18,
                                pivotX: 55,
                                height: 36,
                                fontSize: 35,
                                font: "SimHei",
                                color: "#FFDE46",
                                align: "left"
                            },
                            compId: 11
                        },
                        {
                            type: "Image",
                            props: {
                                y: 38.5,
                                x: 536.5,
                                width: 112.5,
                                var: "UpLvBtn",
                                skin: "Images/Settle/btn_yellow.png",
                                pivotY: 24,
                                pivotX: 57,
                                height: 48.5
                            },
                            compId: 5,
                            child: [{
                                    type: "Sprite",
                                    props: {
                                        y: 22,
                                        x: 57,
                                        width: 58,
                                        var: "sjtp",
                                        texture: "Images/Skin/text_shengji.png",
                                        scaleY: 1,
                                        scaleX: 1,
                                        pivotY: 14,
                                        pivotX: 29,
                                        height: 22
                                    },
                                    compId: 8
                                },
                                {
                                    type: "Sprite",
                                    props: {
                                        y: 24.5,
                                        x: 57,
                                        width: 75,
                                        var: "ymjtp",
                                        texture: "Images/Skin/text_manji.png",
                                        scaleY: 1,
                                        scaleX: 1,
                                        pivotY: 14,
                                        pivotX: 38,
                                        height: 27
                                    },
                                    compId: 9
                                }
                            ]
                        },
                        {
                            type: "Label",
                            props: {
                                y: 78,
                                x: 506.75,
                                width: 73,
                                var: "DiamondLabel",
                                valign: "middle",
                                pivotY: 11,
                                pivotX: 37,
                                height: 22,
                                fontSize: 22,
                                font: "Arial",
                                color: "#ffffff",
                                align: "right"
                            },
                            compId: 6
                        },
                        {
                            type: "Sprite",
                            props: {
                                y: 78,
                                x: 560,
                                width: 53,
                                var: "zstp",
                                texture: "Images/Start/icon_zs_s.png",
                                scaleY: .5,
                                scaleX: .5,
                                pivotY: 23,
                                pivotX: 27,
                                height: 46
                            },
                            compId: 7
                        }
                    ],
                    loadList: ["Images/Skin/skin.png", "Images/Skin/jiantou.png", "Images/Settle/btn_yellow.png", "Images/Skin/text_shengji.png", "Images/Skin/text_manji.png", "Images/Start/icon_zs_s.png"],
                    loadList3D: []
                },
                e.StartDowerItemUI = F,
                t("ui.Scene.StartDowerItemUI", F);
            class X extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/StartPanel")
                }
            }
            e.StartPanelUI = X,
                t("ui.Scene.StartPanelUI", X);
            class Y extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/TeamInvitePanel")
                }
            }
            e.TeamInvitePanelUI = Y,
                t("ui.Scene.TeamInvitePanelUI", Y);
            class K extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(K.uiView)
                }
            }
            K.uiView = {
                    type: "Scene",
                    props: {
                        y: 150,
                        x: 150,
                        width: 300,
                        pivotY: 150,
                        pivotX: 150,
                        height: 300
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                y: 150,
                                x: 150,
                                width: 300,
                                skin: "Images/Start/qipao_tip1.png",
                                sizeGrid: "17,20,26,26",
                                pivotY: 150,
                                pivotX: 150,
                                height: 300
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 135,
                                x: 150,
                                width: 250,
                                var: "Icon",
                                pivotY: 125,
                                pivotX: 125,
                                height: 250
                            },
                            compId: 4
                        },
                        {
                            type: "Label",
                            props: {
                                y: 279,
                                x: 150,
                                width: 250,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 14,
                                pivotX: 125,
                                overflow: "hidden",
                                height: 27,
                                fontSize: 25,
                                font: "SimHei",
                                color: "#000000",
                                align: "center"
                            },
                            compId: 6
                        }
                    ],
                    loadList: ["Images/Start/qipao_tip1.png"],
                    loadList3D: []
                },
                e.TJDownItemUI = K,
                t("ui.Scene.TJDownItemUI", K);
            class j extends Laya.Scene {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.createView(j.uiView)
                }
            }
            j.uiView = {
                    type: "Scene",
                    props: {
                        y: 90,
                        x: 70,
                        width: 140,
                        pivotY: 90,
                        pivotX: 70,
                        height: 180
                    },
                    compId: 2,
                    child: [{
                            type: "Image",
                            props: {
                                width: 140,
                                skin: "Images/Start/qipao_tip1.png",
                                sizeGrid: "15,21,21,29",
                                height: 180
                            },
                            compId: 3
                        },
                        {
                            type: "Image",
                            props: {
                                y: 75,
                                x: 70,
                                width: 125,
                                var: "Icon",
                                pivotY: 63,
                                pivotX: 63,
                                height: 125
                            },
                            compId: 4
                        },
                        {
                            type: "Label",
                            props: {
                                y: 156,
                                x: 70,
                                width: 136,
                                var: "NameLabel",
                                valign: "middle",
                                pivotY: 12,
                                pivotX: 68,
                                overflow: "hidden",
                                height: 24,
                                fontSize: 21,
                                font: "SimHei",
                                color: "#000000",
                                align: "center"
                            },
                            compId: 5
                        }
                    ],
                    loadList: ["Images/Start/qipao_tip1.png"],
                    loadList3D: []
                },
                e.TJUpItemUI = j,
                t("ui.Scene.TJUpItemUI", j);
            class Z extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/TrySkinPanel")
                }
            }
            e.TrySkinPanelUI = Z,
                t("ui.Scene.TrySkinPanelUI", Z);
            class J extends Laya.View {
                constructor() {
                    super()
                }
                createChildren() {
                    super.createChildren(),
                        this.loadScene("Scene/VideoDowerPanel")
                }
            }
            e.VideoDowerPanelUI = J,
                t("ui.Scene.VideoDowerPanelUI", J)
        }(e.Scene || (e.Scene = {}))
    }(e || (e = {}));
    class a {}
    a.IsIphoneX = !1,
        a.IsIphone = !1,
        a.PhoneMsg = {},
        a.ServerUrl = "",
        a.apiKey = "JFOjKLyuqZIF74Bd",
        a.apiSecret = "8e73bab666419069f9271e3c6f8a872f",
        a.apiSign = "",
        a.version = "1.0",
        a.LoginCode = "",
        a.SceneId = 0,
        a.Query = {},
        a.ReferrerInfo = {},
        a.channel = 0,
        a.EncryptedData = "",
        a.Iv = "";
    class i {}
    i.Token = "",
        i.OpenId = "",
        i.Id = 0,
        i.UId = 0,
        i.Name = "Player",
        i.Head = "res/Icon/Head/yktp.jpg",
        i.CurrentTimesTamp = 0,
        i.IsAuthor = !1,
        i.ConfigList = {},
        i.WorldRankList = {},
        i.DayRankList = {},
        i.MyWorldRankList = {},
        i.MyDayRankList = {},
        i.SettleAppList = [],
        i.LikeAppList = [],
        i.SusBannerList = [],
        i.MarBannerList = [],
        i.HotBannerList = [],
        i.BannerList = [],
        i.TodayShareNum = 5,
        i.OverConfig = [],
        i.AwardConfig = [],
        i.SettleConfig = [],
        i.IsLate = 0,
        i.IsShare = 0,
        i.AppWhitList = ["wx783d1a1c3dcec8dd", "wx4b5b8df43210ead8", "wx70649580109e268e", "wx020f4bd36aa02e52", "wx435a9458f92e7f91", "wx1ed16b80e62ea916", "wx4577ee62051c8722", "wxd3c43bf7c3bc778c", "wxed85eb9148d48a24", "wxf1439517533e8128"],
        i.ShareList = [{
                title: "比贪吃蛇好玩多了的游戏是...",
                imageUrl: "",
                imageUrlId: "VT2Pdd6GRYy8B9mzVOVimw=="
            },
            {
                title: "开局一条蛇，游戏内当大爷！",
                imageUrl: "",
                imageUrlId: "KsHoI0KoRKi604DqVzSIDA=="
            },
            {
                title: "打怪升级，竟然可以这么好玩！",
                imageUrl: "",
                imageUrlId: "L3uOnn23SHixa5oT90zUVw=="
            },
            {
                title: "让你享受王者的荣耀，五杀轻松到手！",
                imageUrl: "",
                imageUrlId: "50k7KVgWR7ep26H6fuUmUA=="
            },
            {
                title: "超过80%女生喜欢玩的的游戏居然是这样...",
                imageUrl: "",
                imageUrlId: "xGqDIUuWQ3uNGWEevzm/LQ=="
            },
            {
                title: "摆地摊什么最好卖？不懂的来看看...",
                imageUrl: "",
                imageUrlId: ""
            }
        ],
        i.MiniGameData = [],
        i.SusGameData = [],
        i.IsTrySkinUpCallback = !1,
        i.IsTrySkinDownCallback = !1,
        i.TrySkinUpGameData = [],
        i.TrySkinDownGameData = [],
        i.IsOverCallback = !1,
        i.OverGameData = [],
        i.IsSettleCallback = !1,
        i.SettleExportGameData = [],
        i.IsBuffUpCallback = !1,
        i.IsBuffDownCallback = !1,
        i.BuffUpGameData = [],
        i.BuffDownGameData = [],
        i.IsMFSkinUpCallback = !1,
        i.IsMFSkinDownCallback = !1,
        i.MFSkinUpGameData = [],
        i.MFSkinDownGameData = [],
        i.IsArenaAwardCallBack = !1,
        i.ArenaAwardGameData = [],
        i.IsSettleTJUpCallBack = !1,
        i.SettleTJUpGameData = [],
        i.IsSettleTJDownCallBack = !1,
        i.SettleTJDownGameData = [],
        i.IsDieHit = !1,
        i.IsOpenShouZhi = !1,
        i.IsMusic = !0,
        i.IsSound = !0,
        i.IsVibrate = !0,
        i.IsCountDown = !0,
        i.CountTimer = 10,
        i.OverBoxInitbottom = 100,
        i.SettleBoxInitbottom = 70,
        i.AwardBoxInitbottom = 100,
        i.TrySkinBoxInitbottom = 100,
        i.Boxbottom = 280,
        i.NumData = [],
        i.IsNewSkin = !1,
        i.IsNet = !1,
        i.IsTwoDay = 0,
        i.IsTwoDayTime = 0,
        i.IsRefuseYQ = 0,
        i.IsRefuseYQTime = 0,
        i.IsStartGame = !1,
        i.IsDie = !0,
        i.IsWin = !1,
        i.MaxScore = 0,
        i.MaxLevel = 1,
        i.Badge = 1,
        i.BadgeLv = 1,
        i.MaxExp = 0,
        i.Exp = 0,
        i.Gold = 0,
        i.GetGold = 10,
        i.Diamond = 0,
        i.SkinId = 1,
        i.SkinData = [],
        i.SkinColorId = 1,
        i.SkinColorData = [],
        i.DowerData = [],
        i.Power = 15,
        i.MaxPower = 15,
        i.PowerTimeStamp = 0,
        i.ZeroTimeStamp = 0,
        i.CurrSignDay = 1,
        i.NextSignDay = 1,
        i.IsSign = 0,
        i.IsSevenDay = 0,
        i.GiftIndex = 0,
        i.GiftEightTimeStamp = 0,
        i.FloorSkinId = 1,
        i.ReviveNum = 0,
        i.Score = 0,
        i.LoadingNum = 0,
        i.BallId = 0,
        i.BallList = [],
        i.FloorMatResData = [],
        i.WallMatResData = [],
        i.InviteNum = 0,
        i.NextInviteNum = 0,
        i.IsLotterySkin = 0,
        i.StreakWinNum = 0,
        i.StreakFallNum = 0,
        i.LastLevel = 0,
        i.IsAddBossLv = !1,
        i.EnemyNameData = ["Rex", "IHas", "Asaurus Rex", "Uber", "Rachel", "OMG", "LOL", "LMAO", "Iam", "Milk", "MindOf", "Gamer", "The Gamer", "Dr.Lee", "Popper", "Big", "ItIsYe", "Person", "Captain", "Total", "The Dude", "The Gaming", "Gaming With", "Mr Game", "Ms Game", "Final Hero", "Zombies", "deephug", "Deadbot", "Bodymind", "Ultraland", "Adolescent", "Farwatch", "Halelith", "Eoweraron", "Nydareven", "Zerrac", "Acisien", "Kaigoch", "Peadon", "Demon", "Chihiro", "trammels", "Tenderness", "starry", "Warm summer", "Fairy", "sweet", "Chanel", "leave", "Drunk", "Guppy Girl", "Guppy Person", "Captain Modest", "Patsy Hobbs", "Allure Love", "Velma Middleton", "Avni Lucas", "Terence Mcneil", "JOHN.TONG", "Becca", "Mitzi", "Taylor", "Annie", "Lola", "Conner", "Al", "Harley", "Erik", "Aduwen", "Asteihan", "Glendari", "Galoaw", "Qoilia", "HOT", "Star", "Kraken", "Mad Dog", "Ranger", "Scar", "Dragon", "Slasher", "lola", "Steel Foil", "Wendigo", "Demented", "Berry", "Rocky", "Galen", "Long", "Williams", "Willie", "Abdul", "Rickie", "Craig", "Donovan", "Tuan", "Taylor", "Omer", "Whitney", "Calvin", "Elvin", "Milton", "Merrill", "Bradley", "Stacey", "John", "Delmar", "Elliot", "Roderick", "Brandon", "Branden", "Mohammed", "Gregory", "Isiah", "Pablo", "Eugene", "Donnie", "Seymour", "Elmo", "Ken", "Hal", "Justin", "Isaiah", "Wilbur", "Rickey", "Riley"],
        i.AniamlResNameData = ["Gou", "KeDou", "QiE", "XiangPu", "YeMa", "QingWa", "YaZi", "XiaoZhu", "XiaoJi", "HaiBao", "DaXiang", "WuGui", "She", "XiongMao", "ShiZi", "HaShiQi", "NaiNiu", "KongLong", "HaiTun", "EYu", "YeNiu", "ChangMaoXiang", "XieZi", "Mao", "WoNiu", "ShaYu", "YouLing"],
        i.AniamlNameData = ["Wangwang", "Tadpole", "The Q", "The fatty", "Pony", "Little frog", "Little duck", "Little pig", "Little princess", "Little seal", "Elephant", "Little turtle", "Snake", "Panda", "The Lion King", "Wangcai", "Little cow", "The rex", "Little dolphin", "Baby crocodile", "Bull Demon King", "Woolly mammoth", "The Scorpion King", "Raccoon", "Little snail", "Crazy shark", "Ghost"],
        i.AniamlColorData = ["218,139,2", "50,53,54", "50,53,54", "203,183,109", "147,108,103", "103,154,28", "246,255,255", "240,146,159", "255,255,255", "127,79,65", "0,255,255", "129,188,45", "152,55,188", "255,255,255", "223,223,120", "255,255,255", "255,255,255", "0,255,255", "0,157,255", "15,191,15", "136,138,139", "137,74,59", "141,38,244", "221,170,16", "191,150,134", "41,248,255", "179,206,210"],
        i.AniamlMatResData = [],
        i.BadgeData = ["Bronze", "Silver", "Gold", "Platnum", "Diamond", "Master", "Challenger"],
        i.BadgeLvData = ["I", "II", "III", "IV", "V"],
        i.SkinShopData = [],
        i.SkinDebrisData = [],
        i.SkinDebrisOrderIndex = 0,
        i.SkinDebrisOrderData = [2, 2, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4, 4, 4, 8, 8, 8, 8, 9, 8, 9, 9, 9, 10, 9, 10, 10, 10, 17, 10, 17, 17, 19, 17, 18, 17, 18, 18, 18, 19, 18, 19, 19, 19],
        i.RankBadgeData = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        i.RankBadgeLvData = [2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 3, 3, 3, 2, 2, 1, 1, 1, 5, 5, 4, 4, 4, 3, 3, 2, 2, 2, 1, 1, 5, 5, 5, 4, 4, 3, 3, 3, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1],
        i.RankData = [],
        i.RankLevelTimeStamp = 0,
        i.RankBadgeTimeStamp = 0,
        i.IsMFLottery = 0,
        i.MFLotteryTimeStamp = 0,
        i.LotteryIndex = 1,
        i.LotteryIndexTimeStamp = 0,
        i.IsTowDay = 0,
        i.IsOpenSign = 0,
        i.IsOpenQD = !1,
        i.IsShowBuff = !1,
        i.SettleShareData = {},
        i.IsMFBuff = 0,
        i.IsMFRevive = 0,
        i.IsTwoMFRevive = 0,
        i.BannerNum = 0,
        i.IsAwardJump = !0,
        i.IsSW = !1,
        i.IsLoadRes = !1,
        i.IsOpenSkinPanel = !1,
        i.IsLoadLvEffect = !1,
        i.IsLoadMonsterRes = !1,
        i.IsLoadTailsRes = !1,
        i.IsLoadFloorRes = !1,
        i.IsLoadPropRes = !1,
        i.IsLoadEffectRes = !1,
        i.ReLoadMonsterResData = [],
        i.IsZJKFJJC = !1,
        i.MonsterResData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        i.EffectResData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        i.BenchmarkLevel = 1,
        i.BannerSwitch = 0,
        i.ExportSwitch = 0,
        i.StartSwitch = 0,
        i.StartSusSwitch = 0,
        i.TrySkinSwitch = 0,
        i.OverSwitch = 0,
        i.OverSwitchSub = 0,
        i.SettleSwitch = 0,
        i.BuffSwitch = 0,
        i.MFSkinSwitch = 0,
        i.IsCreateBanner = !0;
    class s {
        static TopUIMatch(e, t) {
            let i = 0;
            if (Laya.Browser.onMiniGame) {
                let s = a.PhoneMsg;
                20 == s.statusBarHeight || (40 == s.statusBarHeight || 44 == s.statusBarHeight || 48 == s.statusBarHeight || 29 == s.statusBarHeight || Laya.stage.height / Laya.stage.width > 2.1) && (i += 65),
                    e.top = i + t
            } else Laya.stage.height / Laya.stage.width > 2.1 && (i += 65),
                e.top = i + t
        }
        static MatchScreen(e, t) {
            e.autoDestroyAtClosed = !0,
                e.width = Laya.stage.width,
                e.height = Laya.stage.height,
                t && (t.width = Laya.stage.width,
                    t.height = Laya.stage.height)
        }
        static SetBtnBottom(e, t) {
            1 == i.BannerSwitch ? a.IsIphoneX ? e.bottom = t + 30 : e.bottom = t - 10 : a.IsIphoneX ? e.bottom = t + 40 : e.bottom = t
        }
        static AddBtnAnimation(e) {
            for (let t = 0; t < e.length; t++)
                e[t].off(Laya.Event.MOUSE_DOWN, this, this.ScaleBig),
                e[t].off(Laya.Event.MOUSE_UP, this, this.ScaleSmall),
                e[t].off(Laya.Event.MOUSE_OUT, this, this.ScaleSmall),
                e[t].on(Laya.Event.MOUSE_DOWN, this, this.ScaleBig, [e[t]]),
                e[t].on(Laya.Event.MOUSE_UP, this, this.ScaleSmall, [e[t]]),
                e[t].on(Laya.Event.MOUSE_OUT, this, this.ScaleSmall, [e[t]])
        }
        static ScaleBig(e) {
            Laya.Tween.to(e, {
                    scaleX: 1.1,
                    scaleY: 1.1
                },
                50)
        }
        static ScaleSmall(e) {
            Laya.Tween.to(e, {
                    scaleX: 1,
                    scaleY: 1
                },
                50)
        }
        static flyDiamondAni(e, t, a, i, s, n, o) {
            for (var r = n.parent || Laya.stage,
                    l = 0; l < 10; l++) {
                let n = new Laya.Image(e);
                r.addChild(n),
                    n.x = t,
                    n.y = a,
                    n.name = "" + l;
                var h = 150 + 10 * [-1, 1][Math.round(Math.random())],
                    c = t + Math.cos(Math.PI / 5 * l) * h,
                    d = a + Math.sin(Math.PI / 5 * l) * h,
                    p = Math.sqrt((t - c) * (t - c) + (a - d) * (a - d)),
                    m = Math.floor(p / 4) / .5;
                Laya.Tween.to(n, {
                        x: c,
                        y: d
                    },
                    m, Laya.Ease.sineIn);
                var y = Math.sqrt((i - c) * (i - c) + (s - d) * (s - d)),
                    f = 2.5 * Math.floor(y / 4);
                Laya.Tween.to(n, {
                        x: i,
                        y: s
                    },
                    f, Laya.Ease.sineIn, Laya.Handler.create(this,
                        function() {
                            "9" == n.name && o && (o.run(), o = null),
                                n.destroy()
                        }), m + 100)
            }
        }
    }
    class n {
        static PlaySound(e) {
            console.log(e + "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee?");
            i.IsSound && (window.WebAudioEngine.playSound("GameScene/Sound/" + e + ".mp3"))
        }
        static PlayBGM() {
            i.IsMusic && (window.WebAudioEngine.playSound("GameScene/Sound/bgm.mp3", !0))
        }
        static PlayBGM1() {
            i.IsMusic && !this.IsPlayBGM1 && (n.IsPlayBGM1 = !0,
                window.WebAudioEngine.playSound("GameScene/Sound/bgm1.mp3", !0))
        }
        static StopBGM1() {
            n.IsPlayBGM1 = !1,
                window.WebAudioEngine.stopSound("GameScene/Sound/bgm.mp3");
            window.WebAudioEngine.stopSound("GameScene/Sound/bgm1.mp3");
        }
        static PlayVibrateShort() {
            //i.IsVibrate && window.wx && window.wx.vibrateShort()
        }
        static PlayVibrateLong() {
            //i.IsVibrate && window.wx && window.wx.vibrateLong()
        }
    }
    n.IsPlayBGM1 = !1;
    class o {
        static getAngle(e, t, a, i) {
            return Math.atan2(e - t, a - i)
        }
        static getDistance(e, t, a, i) {
            var s = t - e,
                n = i - a;
            return Math.pow(s * s + n * n, .5)
        }
        static getDistanceSquare(e, t, a, i) {
            var s = t - e,
                n = i - a;
            return s * s + n * n
        }
        static GetRandFloat(e, t) {
            return Math.random() * (t - e) + e
        }
        static GetRandInt(e, t) {
            return Math.round(Math.random() * (t - e) + e)
        }
        static GetCheckBingo(e) {
            return this.GetRandInt(1, 100) <= e
        }
        static RangeArray(e, t, a, i) {
            if (e >= t) return null;
            if (a > t - e + 1) return null;
            var s = new Array;
            if (i)
                for (; s.length < a;) s.push(this.GetRandInt(e, t));
            else
                for (; s.length < a;) {
                    var n = this.GetRandInt(e, t); - 1 == s.indexOf(n) && s.push(n)
                }
            return s
        }
        static GetDataRandom(e) {
            var t = e.arry,
                a = e.range;
            a = a > t.length ? t.length : a;
            for (var i = [].concat(t), s = [], n = 0; n < a; n++) {
                var o = Math.floor(Math.random() * i.length);
                s.push(i[o]),
                    i.splice(o, 1)
            }
            return s
        }
        static GetArrDifference(e, t) {
            return e.concat(t).filter(function(e, t, a) {
                return a.indexOf(e) === a.lastIndexOf(e)
            })
        }
        static arrayRepeat(e, t) {
            for (var a = [], i = 0; i < t.length; i++) {
                for (var s = t[i], n = s.skinid, o = !1, r = 0; r < e.length; r++) {
                    if (e[r] === n) {
                        o = !0;
                        break
                    }
                }
                o || a.push(s)
            }
            return a
        }
        static DataOutRep(e) {
            for (var t = [], a = 0, i = e.length; a < i; a++) {
                for (var s = a + 1; s < i; s++) e[a] == e[s] && ++a;
                t.push(e[a])
            }
            return t
        }
        static mixArray(e) {
            for (var t = 0,
                    a = Math.round(e.length / 2); t < a; t++) {
                var i = this.GetRandInt(0, e.length),
                    s = this.GetRandInt(0, e.length),
                    n = e[i];
                e[i] = e[s],
                    e[s] = n
            }
            return e
        }
        static GetNonredundantNum() {
            for (var e = [], t = 1; t <= 100; t++) e.push(t);
            return e.sort(function() {
                    return Math.random() - .5
                }),
                e.length = 10,
                e
        }
        static GetNonredundantNum1() {
            for (var e = [], t = 1; t <= 100; t++) e.push(t);
            return e.sort(function() {
                    return Math.random() - .5
                }),
                e
        }
        static isToday(e, t = 0) {
            t = t || Laya.Browser.now();
            var a = new Date(e),
                i = new Date(t);
            return a.getFullYear() == i.getFullYear() && a.getMonth() == i.getMonth() && a.getDate() == i.getDate()
        }
        static Addo(e) {
            return e < 10 ? "0" + e : e
        }
        static isNumber(e) {
            return !(!/^\d+(\.\d+)?$/.test(e) && !/^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/.test(e))
        }
    }
    class r {
        static getKey(e) {
            return "_" + e
        }
        static removeKey(e) {
            e = this.getKey(e),
                localStorage.removeItem(e)
        }
        static save_int(e, t) {
            e = this.getKey(e),
                localStorage.setItem(e, t.toString())
        }
        static load_int(e) {
            return e = this.getKey(e),
                parseInt(localStorage.getItem(e))
        }
        static save_float(e, t) {
            e = this.getKey(e),
                localStorage.setItem(e, t.toString())
        }
        static load_float(e) {
            return e = this.getKey(e),
                parseFloat(localStorage.getItem(e))
        }
        static save_string(e, t) {
            e = this.getKey(e),
                localStorage.setItem(e, t)
        }
        static load_string(e) {
            return e = this.getKey(e),
                localStorage.getItem(e)
        }
        static save_boolean(e, t) {
            e = this.getKey(e),
                t ? this.save_int(e, 1) : this.save_int(e, 0)
        }
        static load_boolean(e) {
            return e = this.getKey(e),
                1 == this.load_int(e)
        }
    }
    var l = 8;

    function hex_md5(e) {
        return function(e) {
            for (var t = "",
                    a = 0; a < 4 * e.length; a++) t += "0123456789abcdef".charAt(e[a >> 2] >> a % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(e[a >> 2] >> a % 4 * 8 & 15);
            return t
        }(function(e, t) {
            e[t >> 5] |= 128 << t % 32,
                e[14 + (t + 64 >>> 9 << 4)] = t;
            for (var a = 1732584193,
                    i = -271733879,
                    s = -1732584194,
                    n = 271733878,
                    o = 0; o < e.length; o += 16) {
                var r = a,
                    l = i,
                    h = s,
                    c = n;
                a = md5_ff(a, i, s, n, e[o + 0], 7, -680876936),
                    n = md5_ff(n, a, i, s, e[o + 1], 12, -389564586),
                    s = md5_ff(s, n, a, i, e[o + 2], 17, 606105819),
                    i = md5_ff(i, s, n, a, e[o + 3], 22, -1044525330),
                    a = md5_ff(a, i, s, n, e[o + 4], 7, -176418897),
                    n = md5_ff(n, a, i, s, e[o + 5], 12, 1200080426),
                    s = md5_ff(s, n, a, i, e[o + 6], 17, -1473231341),
                    i = md5_ff(i, s, n, a, e[o + 7], 22, -45705983),
                    a = md5_ff(a, i, s, n, e[o + 8], 7, 1770035416),
                    n = md5_ff(n, a, i, s, e[o + 9], 12, -1958414417),
                    s = md5_ff(s, n, a, i, e[o + 10], 17, -42063),
                    i = md5_ff(i, s, n, a, e[o + 11], 22, -1990404162),
                    a = md5_ff(a, i, s, n, e[o + 12], 7, 1804603682),
                    n = md5_ff(n, a, i, s, e[o + 13], 12, -40341101),
                    s = md5_ff(s, n, a, i, e[o + 14], 17, -1502002290),
                    i = md5_ff(i, s, n, a, e[o + 15], 22, 1236535329),
                    a = md5_gg(a, i, s, n, e[o + 1], 5, -165796510),
                    n = md5_gg(n, a, i, s, e[o + 6], 9, -1069501632),
                    s = md5_gg(s, n, a, i, e[o + 11], 14, 643717713),
                    i = md5_gg(i, s, n, a, e[o + 0], 20, -373897302),
                    a = md5_gg(a, i, s, n, e[o + 5], 5, -701558691),
                    n = md5_gg(n, a, i, s, e[o + 10], 9, 38016083),
                    s = md5_gg(s, n, a, i, e[o + 15], 14, -660478335),
                    i = md5_gg(i, s, n, a, e[o + 4], 20, -405537848),
                    a = md5_gg(a, i, s, n, e[o + 9], 5, 568446438),
                    n = md5_gg(n, a, i, s, e[o + 14], 9, -1019803690),
                    s = md5_gg(s, n, a, i, e[o + 3], 14, -187363961),
                    i = md5_gg(i, s, n, a, e[o + 8], 20, 1163531501),
                    a = md5_gg(a, i, s, n, e[o + 13], 5, -1444681467),
                    n = md5_gg(n, a, i, s, e[o + 2], 9, -51403784),
                    s = md5_gg(s, n, a, i, e[o + 7], 14, 1735328473),
                    i = md5_gg(i, s, n, a, e[o + 12], 20, -1926607734),
                    a = md5_hh(a, i, s, n, e[o + 5], 4, -378558),
                    n = md5_hh(n, a, i, s, e[o + 8], 11, -2022574463),
                    s = md5_hh(s, n, a, i, e[o + 11], 16, 1839030562),
                    i = md5_hh(i, s, n, a, e[o + 14], 23, -35309556),
                    a = md5_hh(a, i, s, n, e[o + 1], 4, -1530992060),
                    n = md5_hh(n, a, i, s, e[o + 4], 11, 1272893353),
                    s = md5_hh(s, n, a, i, e[o + 7], 16, -155497632),
                    i = md5_hh(i, s, n, a, e[o + 10], 23, -1094730640),
                    a = md5_hh(a, i, s, n, e[o + 13], 4, 681279174),
                    n = md5_hh(n, a, i, s, e[o + 0], 11, -358537222),
                    s = md5_hh(s, n, a, i, e[o + 3], 16, -722521979),
                    i = md5_hh(i, s, n, a, e[o + 6], 23, 76029189),
                    a = md5_hh(a, i, s, n, e[o + 9], 4, -640364487),
                    n = md5_hh(n, a, i, s, e[o + 12], 11, -421815835),
                    s = md5_hh(s, n, a, i, e[o + 15], 16, 530742520),
                    i = md5_hh(i, s, n, a, e[o + 2], 23, -995338651),
                    a = md5_ii(a, i, s, n, e[o + 0], 6, -198630844),
                    n = md5_ii(n, a, i, s, e[o + 7], 10, 1126891415),
                    s = md5_ii(s, n, a, i, e[o + 14], 15, -1416354905),
                    i = md5_ii(i, s, n, a, e[o + 5], 21, -57434055),
                    a = md5_ii(a, i, s, n, e[o + 12], 6, 1700485571),
                    n = md5_ii(n, a, i, s, e[o + 3], 10, -1894986606),
                    s = md5_ii(s, n, a, i, e[o + 10], 15, -1051523),
                    i = md5_ii(i, s, n, a, e[o + 1], 21, -2054922799),
                    a = md5_ii(a, i, s, n, e[o + 8], 6, 1873313359),
                    n = md5_ii(n, a, i, s, e[o + 15], 10, -30611744),
                    s = md5_ii(s, n, a, i, e[o + 6], 15, -1560198380),
                    i = md5_ii(i, s, n, a, e[o + 13], 21, 1309151649),
                    a = md5_ii(a, i, s, n, e[o + 4], 6, -145523070),
                    n = md5_ii(n, a, i, s, e[o + 11], 10, -1120210379),
                    s = md5_ii(s, n, a, i, e[o + 2], 15, 718787259),
                    i = md5_ii(i, s, n, a, e[o + 9], 21, -343485551),
                    a = safe_add(a, r),
                    i = safe_add(i, l),
                    s = safe_add(s, h),
                    n = safe_add(n, c)
            }
            return Array(a, i, s, n)
        }(function(e) {
            for (var t = Array(), a = (1 << l) - 1, i = 0; i < e.length * l; i += l) t[i >> 5] |= (e.charCodeAt(i / l) & a) << i % 32;
            return t
        }(e), e.length * l))
    }

    function md5_cmn(e, t, a, i, s, n) {
        return safe_add((o = safe_add(safe_add(t, e), safe_add(i, n))) << (r = s) | o >>> 32 - r, a);
        var o, r
    }

    function md5_ff(e, t, a, i, s, n, o) {
        return md5_cmn(t & a | ~t & i, e, t, s, n, o)
    }

    function md5_gg(e, t, a, i, s, n, o) {
        return md5_cmn(t & i | a & ~i, e, t, s, n, o)
    }

    function md5_hh(e, t, a, i, s, n, o) {
        return md5_cmn(t ^ a ^ i, e, t, s, n, o)
    }

    function md5_ii(e, t, a, i, s, n, o) {
        return md5_cmn(a ^ (t | ~i), e, t, s, n, o)
    }

    function safe_add(e, t) {
        var a = (65535 & e) + (65535 & t);
        return (e >> 16) + (t >> 16) + (a >> 16) << 16 | 65535 & a
    }
    class h {
        static SendMsgToServer(e, t, s) {
            // let n,
            // o = {},
            // r = [];
            // switch (e) {
            // case "get_user_base_info":
            // 	r = []
            // }
            // o = this.GetParam(r),
            // n = this.ParamJoint(o, e);
            // let l = new Laya.HttpRequest;
            // l.http.timeout = 1e4,
            // l.once(Laya.Event.COMPLETE, this, t =>{
            // 	if (t) switch (e) {
            // 	case "get_user_base_info":
            // 		console.log("获取玩家基础信息成功！", t),
            // 		t && "sucess" == t.code && (i.BannerSwitch = t.data.modular_switch[3].
            // 		switch, i.ExportSwitch = t.data.modular_switch[5].
            // 		switch, i.StartSwitch = t.data.modular_switch[6].
            // 		switch, i.StartSusSwitch = t.data.modular_switch[7].
            // 		switch, i.TrySkinSwitch = t.data.modular_switch[8].
            // 		switch, i.OverSwitch = t.data.modular_switch[9].
            // 		switch, i.OverSwitchSub = t.data.modular_switch[10].
            // 		switch, i.SettleSwitch = t.data.modular_switch[11].
            // 		switch, i.BuffSwitch = t.data.modular_switch[12].
            // 		switch, i.MFSkinSwitch = t.data.modular_switch[13].
            // 		switch)
            // 	}
            // }),
            // l.once(Laya.Event.ERROR, this, e =>{
            // 	h.SendMsgToServer("get_user_base_info")
            // }),
            // l.send(a.ServerUrl + n, null, "post", "json")
        }
        static GetTimestamp() {
            let e = new Date,
                t = e.getFullYear(),
                a = e.getMonth() + 1,
                i = e.getDate(),
                s = e.getHours();
            return new Date(t + "/" + a + "/" + i + " " + s + ":00:00").getTime() / 1e3
        }
        static GetParam(e) {
            var t = {};
            t.uid = i.UId,
                t.sign = hex_md5(a.apiKey + i.UId + this.GetTimestamp());
            for (let a = 0; a < e.length; a++) t[e[a].key] = e[a].value;
            return t
        }
        static ParamJoint(e, t) {
            let a = "?action=" + t + "&";
            for (var i in e) a += i += "=" + e[i] + "&";
            return a = a.substring(0, a.length - 1)
        }
        static buildQueryString(e) {
            return Object.keys(e).map(t => encodeURIComponent(t) + "=" + encodeURIComponent(e[t])).join("&")
        }
    }
    class c {
        static SendMsgToServer(e, t) {
            // let a,
            // i = {},
            // s = e;
            // i = this.GetParam(s),
            // a = this.ParamJoint(i);
            // let n = new Laya.HttpRequest;
            // n.http.timeout = 1e4,
            // n.once(Laya.Event.COMPLETE, this, e =>{}),
            // n.once(Laya.Event.ERROR, this, e =>{}),
            // n.send(c.ServerUrl + a, null, "post", "json")
        }
        static GetTimestamp() {
            let e = new Date,
                t = e.getFullYear(),
                a = e.getMonth() + 1,
                i = e.getDate(),
                s = e.getHours();
            return new Date(t + "/" + a + "/" + i + " " + s + ":00:00").getTime() / 1e3
        }
        static GetParam(e) {
            var t = {};
            t.ghid = c.ghid,
                t.uid = c.UId;
            for (let a = 0; a < e.length; a++) t[e[a].key] = e[a].value;
            let a = [{
                    key: "apiKey",
                    value: c.apiKey
                },
                {
                    key: "ghid",
                    value: c.ghid
                },
                {
                    key: "uid",
                    value: c.UId
                }
            ];
            for (let t = 0; t < e.length; t++) a.push(e[t]);
            for (let e = 0; e < a.length; e++) "u_lev" == a[e].key && (a[e].key = "ulev");
            a.sort(function(e) {
                return function(t, a) {
                    var i = t[e],
                        s = a[e];
                    return s < i ? 1 : s > i ? -1 : 0
                }
            }("key"));
            for (let e = 0; e < a.length; e++) "ulev" == a[e].key && (a[e].key = "u_lev");
            let i = "";
            for (let e = 0; e < a.length; e++) i += a[e].value;
            return i += this.GetTimestamp(),
                t.sign = hex_md5(i),
                t
        }
        static ParamJoint(e) {
            let t = "?";
            for (var a in e) t += a += "=" + e[a] + "&";
            return t = t.substring(0, t.length - 1)
        }
        static buildQueryString(e) {
            return Object.keys(e).map(t => encodeURIComponent(t) + "=" + encodeURIComponent(e[t])).join("&")
        }
    }
    c.ServerUrl = "",
        c.apiKey = "vtrIWjgjA428npKK",
        c.ghid = "gh_725f4f98ac66",
        c.UId = 0;
    class d {
        static SendMsgToServer(e, t, s) {
            // let n,
            // o = {},
            // r = [];
            // switch (e) {
            // case "export_game":
            // 	r = [{
            // 		key: "ghid",
            // 		value: d.ghid
            // 	},
            // 	{
            // 		key: "list_type",
            // 		value: t[0]
            // 	},
            // 	{
            // 		key: "channel",
            // 		value: a.channel
            // 	}];
            // 	break;
            // case "game_event":
            // 	r = [{
            // 		key: "ghid",
            // 		value: d.ghid
            // 	},
            // 	{
            // 		key: "list_type",
            // 		value: t[0]
            // 	},
            // 	{
            // 		key: "location_index",
            // 		value: t[1]
            // 	},
            // 	{
            // 		key: "event_code",
            // 		value: t[2]
            // 	},
            // 	{
            // 		key: "channel",
            // 		value: a.channel
            // 	}]
            // }
            // o = this.GetParam(r),
            // n = this.ParamJoint(o, e);
            // let l = new Laya.HttpRequest;
            // l.http.timeout = 1e4,
            // l.once(Laya.Event.COMPLETE, this, a =>{
            // 	if (a) switch (e) {
            // 	case "export_game":
            // 		switch (t[0]) {
            // 		case 1:
            // 			i.MiniGameData = a.data,
            // 			console.log("UserData.MiniGameData", i.MiniGameData);
            // 			break;
            // 		case 2:
            // 			i.SusGameData = a.data,
            // 			console.log("UserData.SusGameData", i.SusGameData);
            // 			break;
            // 		case 3:
            // 			i.TrySkinUpGameData = a.data,
            // 			console.log("UserData.TrySkinUpGameData", i.TrySkinUpGameData);
            // 			break;
            // 		case 4:
            // 			i.TrySkinDownGameData = a.data,
            // 			console.log("UserData.TrySkinDownGameData", i.TrySkinDownGameData);
            // 			break;
            // 		case 5:
            // 			i.OverGameData = a.data,
            // 			console.log("UserData.OverGameData", i.OverGameData);
            // 			break;
            // 		case 6:
            // 			i.SettleExportGameData = a.data,
            // 			console.log("UserData.SettleExportGameData", i.SettleExportGameData),
            // 			i.IsSettleCallback = !0;
            // 			break;
            // 		case 7:
            // 			i.BuffUpGameData = a.data,
            // 			console.log("UserData.BuffUpGameData", i.BuffUpGameData);
            // 			break;
            // 		case 8:
            // 			i.BuffDownGameData = a.data,
            // 			console.log("UserData.BuffDownGameData", i.BuffDownGameData);
            // 			break;
            // 		case 9:
            // 			i.MFSkinUpGameData = a.data,
            // 			console.log("UserData.MFSkinUpGameData", i.MFSkinUpGameData);
            // 			break;
            // 		case 10:
            // 			i.MFSkinDownGameData = a.data,
            // 			console.log("UserData.MFSkinDownGameData", i.MFSkinDownGameData);
            // 			break;
            // 		case 11:
            // 			i.ArenaAwardGameData = a.data,
            // 			console.log("UserData.ArenaAwardGameData", i.ArenaAwardGameData);
            // 			break;
            // 		case 12:
            // 			i.SettleTJUpGameData = a.data,
            // 			console.log("UserData.SettleTJUpGameData", i.SettleTJUpGameData);
            // 			break;
            // 		case 13:
            // 			i.SettleTJDownGameData = a.data,
            // 			console.log("UserData.SettleTJDownGameData", i.SettleTJDownGameData)
            // 		}
            // 		s && s.run()
            // 	}
            // }),
            // l.once(Laya.Event.ERROR, this, a =>{
            // 	switch (e) {
            // 	case "export_game":
            // 		switch (t[0]) {
            // 		case 1:
            // 			d.SendMsgToServer("export_game", [1]);
            // 			break;
            // 		case 2:
            // 			d.SendMsgToServer("export_game", [2]);
            // 			break;
            // 		case 3:
            // 			d.SendMsgToServer("export_game", [3]);
            // 			break;
            // 		case 4:
            // 			d.SendMsgToServer("export_game", [4]);
            // 			break;
            // 		case 5:
            // 			d.SendMsgToServer("export_game", [5]);
            // 			break;
            // 		case 6:
            // 			d.SendMsgToServer("export_game", [6]);
            // 			break;
            // 		case 7:
            // 			d.SendMsgToServer("export_game", [7]);
            // 			break;
            // 		case 8:
            // 			d.SendMsgToServer("export_game", [8]);
            // 			break;
            // 		case 9:
            // 			d.SendMsgToServer("export_game", [9]);
            // 			break;
            // 		case 10:
            // 			d.SendMsgToServer("export_game", [10]);
            // 			break;
            // 		case 11:
            // 			d.SendMsgToServer("export_game", [11]);
            // 			break;
            // 		case 12:
            // 			d.SendMsgToServer("export_game", [12]);
            // 			break;
            // 		case 13:
            // 			d.SendMsgToServer("export_game", [13])
            // 		}
            // 	}
            // })
            //l.send(d.ServerUrl + n, null, "post", "json")
        }
        static GetTimestamp() {
            let e = new Date,
                t = e.getFullYear(),
                a = e.getMonth() + 1,
                i = e.getDate(),
                s = e.getHours();
            return new Date(t + "/" + a + "/" + i + " " + s + ":00:00").getTime() / 1e3
        }
        static GetParam(e) {
            var t = {};
            t.uid = i.UId,
                t.sign = hex_md5(d.apiKey + i.UId + this.GetTimestamp());
            for (let a = 0; a < e.length; a++) t[e[a].key] = e[a].value;
            return t
        }
        static ParamJoint(e, t) {
            let a = "?action=" + t + "&";
            for (var i in e) a += i += "=" + e[i] + "&";
            return a = a.substring(0, a.length - 1)
        }
        static buildQueryString(e) {
            return Object.keys(e).map(t => encodeURIComponent(t) + "=" + encodeURIComponent(e[t])).join("&")
        }
    }
    d.ServerUrl = "",
        d.apiKey = "6BEAOZ8BTB1IRLpb",
        d.ghid = "gh_725f4f98ac66";
    class p extends Laya.Script {
        static Init(e, t) {
            this.MonsterResData = e,
                this.IsFirst = t;
            let a = [];
            for (let e = 0; e < this.MonsterResData.length; e++) {
                let t = "";
                switch (this.MonsterResData[e]) {
                    case 0:
                        t = "GameScene/Monster/Conventional/Monster.lh";
                        break;
                    case 1:
                        t = "GameScene/Monster/Conventional/Gou.lh";
                        break;
                    case 2:
                        t = "GameScene/Monster/Conventional/KeDou.lh";
                        break;
                    case 3:
                        t = "GameScene/Monster/Conventional/QiE.lh";
                        break;
                    case 4:
                        t = "GameScene/Monster/Conventional/XiangPu.lh";
                        break;
                    case 5:
                        t = "GameScene/Monster/Conventional/YeMa.lh";
                        break;
                    case 6:
                        t = "GameScene/Monster/Conventional/QingWa.lh";
                        break;
                    case 7:
                        t = "GameScene/Monster/Conventional/YaZi.lh";
                        break;
                    case 8:
                        t = "GameScene/Monster/Conventional/XiaoZhu.lh";
                        break;
                    case 9:
                        t = "GameScene/Monster/Conventional/XiaoJi.lh";
                        break;
                    case 10:
                        t = "GameScene/Monster/Conventional/HaiBao.lh";
                        break;
                    case 11:
                        t = "GameScene/Monster/Conventional/DaXiang.lh";
                        break;
                    case 12:
                        t = "GameScene/Monster/Conventional/WuGui.lh";
                        break;
                    case 13:
                        t = "GameScene/Monster/Conventional/She.lh";
                        break;
                    case 14:
                        t = "GameScene/Monster/Conventional/XiongMao.lh";
                        break;
                    case 15:
                        t = "GameScene/Monster/Conventional/ShiZi.lh";
                        break;
                    case 16:
                        t = "GameScene/Monster/Conventional/HaShiQi.lh";
                        break;
                    case 17:
                        t = "GameScene/Monster/Conventional/NaiNiu.lh";
                        break;
                    case 18:
                        t = "GameScene/Monster/Conventional/KongLong.lh";
                        break;
                    case 19:
                        t = "GameScene/Monster/Conventional/HaiTun.lh";
                        break;
                    case 20:
                        t = "GameScene/Monster/Conventional/EYu.lh";
                        break;
                    case 21:
                        t = "GameScene/Monster/Conventional/YeNiu.lh";
                        break;
                    case 22:
                        t = "GameScene/Monster/Conventional/ChangMaoXiang.lh";
                        break;
                    case 23:
                        t = "GameScene/Monster/Conventional/XieZi.lh";
                        break;
                    case 24:
                        t = "GameScene/Monster/Conventional/Mao.lh";
                        break;
                    case 25:
                        t = "GameScene/Monster/Conventional/WoNiu.lh";
                        break;
                    case 26:
                        t = "GameScene/Monster/Conventional/ShaYu.lh";
                        break;
                    case 27:
                        t = "GameScene/Monster/Conventional/YouLing.lh"
                }
                a.push(t)
            }
            Laya.loader.create(a, Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            for (let e = 0; e < this.MonsterResData.length; e++) {
                let t;
                switch (this.MonsterResData[e]) {
                    case 0:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/Monster.lh");
                        break;
                    case 1:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/Gou.lh");
                        break;
                    case 2:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/KeDou.lh");
                        break;
                    case 3:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/QiE.lh");
                        break;
                    case 4:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/XiangPu.lh");
                        break;
                    case 5:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/YeMa.lh");
                        break;
                    case 6:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/QingWa.lh");
                        break;
                    case 7:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/YaZi.lh");
                        break;
                    case 8:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/XiaoZhu.lh");
                        break;
                    case 9:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/XiaoJi.lh");
                        break;
                    case 10:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/HaiBao.lh");
                        break;
                    case 11:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/DaXiang.lh");
                        break;
                    case 12:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/WuGui.lh");
                        break;
                    case 13:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/She.lh");
                        break;
                    case 14:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/XiongMao.lh");
                        break;
                    case 15:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/ShiZi.lh");
                        break;
                    case 16:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/HaShiQi.lh");
                        break;
                    case 17:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/NaiNiu.lh");
                        break;
                    case 18:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/KongLong.lh");
                        break;
                    case 19:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/HaiTun.lh");
                        break;
                    case 20:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/EYu.lh");
                        break;
                    case 21:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/YeNiu.lh");
                        break;
                    case 22:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/ChangMaoXiang.lh");
                        break;
                    case 23:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/XieZi.lh");
                        break;
                    case 24:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/Mao.lh");
                        break;
                    case 25:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/WoNiu.lh");
                        break;
                    case 26:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/ShaYu.lh");
                        break;
                    case 27:
                        t = Laya.loader.getRes("GameScene/Monster/Conventional/YouLing.lh")
                }
                this.MonsterData.addChild(t)
            }
            0 == this.IsFirst ? (console.log("!!!!!!!!!!!!!!!11111:", this.MonsterData), Laya.BaseMaterial.load("GameScene/Monster/Conventional/Assets/material/jiaose.lmat", Laya.Handler.create(null,
                function(e) {
                    i.AniamlMatResData.push(e),
                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/modet/Materials/skin2.lmat", Laya.Handler.create(null,
                            function(e) {
                                i.AniamlMatResData.push(e),
                                    Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/modet/Materials/skin3.lmat", Laya.Handler.create(null,
                                        function(e) {
                                            i.AniamlMatResData.push(e),
                                                Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/modet/Materials/skin4.lmat", Laya.Handler.create(null,
                                                    function(e) {
                                                        i.AniamlMatResData.push(e),
                                                            Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/modet/Materials/skin5.lmat", Laya.Handler.create(null,
                                                                function(e) {
                                                                    i.AniamlMatResData.push(e),
                                                                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/modet/Materials/skin6.lmat", Laya.Handler.create(null,
                                                                            function(e) {

                                                                                i.AniamlMatResData.push(e),
                                                                                    i.LoadingNum++,
                                                                                    //console.log("人物模型加载成功！当前进度是：" + i.LoadingNum),
                                                                                    console.log(i.AniamlMatResData)
                                                                            }))
                                                                }))
                                                    }))
                                        }))
                            }))
                }))) : 1 == this.IsFirst ? (console.log("!!!!!!!!!!!!!!!22222:", this.MonsterData), i.IsOpenSkinPanel = !0) : 2 == this.IsFirst && console.log("this.MonsterData:", this.MonsterData)
        }
        static SelectMonster(e) {
            return Laya.Sprite3D.instantiate(this.MonsterData.getChildByName(e))
        }
    }
    p.MonsterData = new Laya.Sprite3D,
        p.MonsterResData = [],
        p.IsFirst = 0;
    class m extends Laya.Script {
        static Init() {
            Laya.loader.create(["GameScene/Prop/Conventional/Prop.lh"], Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            this.PropData = Laya.loader.getRes("GameScene/Prop/Conventional/Prop.lh"),
                console.log("this.PropData:", this.PropData),
                i.IsLoadPropRes = !0
        }
        static SelectProp(e) {
            return Laya.Sprite3D.instantiate(this.PropData.getChildByName(e))
        }
    }
    class y extends Laya.Script {
        static Init() {
            Laya.loader.create(["GameScene/Tails/Conventional/Tails.lh"], Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            this.TailsData = Laya.loader.getRes("GameScene/Tails/Conventional/Tails.lh"),
                console.log("this.TailsData:", this.TailsData),
                i.IsLoadTailsRes = !0;
            let e = i.SkinData,
                t = o.GetArrDifference(e, [i.SkinId]);
            0 != t.length ? p.Init(t, 1) : i.IsOpenSkinPanel = !0,
                m.Init()
        }
        static SelectTails(e) {
            return Laya.Sprite3D.instantiate(this.TailsData.getChildByName(e))
        }
    }
    class f extends Laya.Script {
        static Init(e, t) {
            this.EffectResData = e,
                this.IsFirst = t;
            let a = [];
            for (let e = 0; e < this.EffectResData.length; e++) {
                let t = "";
                switch (this.EffectResData[e]) {
                    case 1:
                        t = "GameScene/Effect/Conventional/Like.lh";
                        break;
                    case 2:
                        t = "GameScene/Effect/Conventional/LuoShui.lh";
                        break;
                    case 3:
                        t = "GameScene/Effect/Conventional/Yan.lh";
                        break;
                    case 4:
                        t = "GameScene/Effect/Conventional/Du.lh";
                        break;
                    case 5:
                        t = "GameScene/Effect/Conventional/BaoZha.lh";
                        break;
                    case 6:
                        t = "GameScene/Effect/Conventional/DaJi.lh";
                        break;
                    case 7:
                        t = "GameScene/Effect/Conventional/ZhaDan.lh";
                        break;
                    case 8:
                        t = "GameScene/Effect/Conventional/Xue.lh";
                        break;
                    case 9:
                        t = "GameScene/Effect/Conventional/YanHua.lh";
                        break;
                    case 10:
                        t = "GameScene/Effect/Conventional/Gold.lh";
                        break;
                    case 11:
                        t = "GameScene/Effect/Conventional/Boss.lh";
                        break;
                    case 12:
                        t = "GameScene/Effect/Conventional/JDBHZ.lh";
                        break;
                    case 13:
                        t = "GameScene/Effect/Conventional/DowerLv.lh";
                        break;
                    case 14:
                        t = "GameScene/Effect/Conventional/PebbleBaoZha.lh";
                        break;
                    case 15:
                        t = "GameScene/Effect/Conventional/JiSui.lh"
                }
                a.push(t)
            }
            Laya.loader.create(a, Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            for (let e = 0; e < this.EffectResData.length; e++) {
                let t;
                switch (this.EffectResData[e]) {
                    case 1:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Like.lh");
                        break;
                    case 2:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/LuoShui.lh");
                        break;
                    case 3:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Yan.lh");
                        break;
                    case 4:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Du.lh");
                        break;
                    case 5:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/BaoZha.lh");
                        break;
                    case 6:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/DaJi.lh");
                        break;
                    case 7:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/ZhaDan.lh");
                        break;
                    case 8:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Xue.lh");
                        break;
                    case 9:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/YanHua.lh");
                        break;
                    case 10:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Gold.lh");
                        break;
                    case 11:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/Boss.lh");
                        break;
                    case 12:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/JDBHZ.lh");
                        break;
                    case 13:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/DowerLv.lh");
                        break;
                    case 14:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/PebbleBaoZha.lh");
                        break;
                    case 15:
                        t = Laya.loader.getRes("GameScene/Effect/Conventional/JiSui.lh")
                }
                this.EffectData.addChild(t)
            }
            this.IsFirst ? (D._Instance.initdowerlv(), i.LoadingNum++,
                //console.log("特效资源加载成功！当前进度是：" + i.LoadingNum), 
                i.IsLoadLvEffect = !0) : (console.log("this.EffectData:", this.EffectData), D._Instance.init())
        }
        static SelectEffect(e) {
            if (this.EffectData) {
                return Laya.Sprite3D.instantiate(this.EffectData.getChildByName(e))
            }
            return null
        }
    }
    f.EffectData = new Laya.Sprite3D,
        f.EffectResData = [],
        f.IsFirst = !1;
    class S extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.ReMoveIndex = 0,
                this.ReMoveMaxIndex = 0
        }
        onAwake() {
            this.owner.name == D.Name_Effect_LikeEffect ? this.ReMoveMaxIndex = 60 : this.owner.name == D.Name_Effect_YanEffect ? this.ReMoveMaxIndex = 120 : this.owner.name == D.Name_Effect_LuoShuiEffect ? this.ReMoveMaxIndex = 78 : this.owner.name == D.Name_Effect_DuEffect ? this.ReMoveMaxIndex = 90 : this.owner.name == D.Name_Effect_BaoZhaEffect ? this.ReMoveMaxIndex = 138 : this.owner.name == D.Name_Effect_DaJiEffect ? this.ReMoveMaxIndex = 48 : this.owner.name == D.Name_Effect_Xueffect ? this.ReMoveMaxIndex = 90 : this.owner.name == D.Name_Effect_YanHuaeffect ? this.ReMoveMaxIndex = 120 : this.owner.name == D.Name_Effect_Goldeffect ? this.ReMoveMaxIndex = 60 : this.owner.name == D.Name_EffectJDBHZeffect ? this.ReMoveMaxIndex = 54 : this.owner.name == D.Name_EffectPebbleBaoZhaeffect ? this.ReMoveMaxIndex = 120 : this.owner.name == D.Name_EffectJiSuieffect && (this.ReMoveMaxIndex = 60)
        }
        onUpdate() {
            this.Target && (this.owner.name == D.Name_Effect_LikeEffect ? this.owner.transform.position = new Laya.Vector3(this.Target.transform.position.x, this.Target.transform.position.y + .5, this.Target.transform.position.z) : this.owner.name == D.Name_Effect_YanEffect ? this.owner.transform.position = this.Target.transform.position : this.owner.name == D.Name_Effect_Bosseffect && (this.owner.transform.position = this.Target.transform.position)),
                "XiaXue" == this.owner.name && N._Instance.Camera && (this.owner.transform.position = new Laya.Vector3(N._Instance.Camera.transform.position.x, N._Instance.Camera.transform.position.y - 1, N._Instance.Camera.transform.position.z - 5.5)),
                "XinHai" == this.owner.name && N._Instance.Camera && (this.owner.transform.position = new Laya.Vector3(N._Instance.Camera.transform.position.x, N._Instance.Camera.transform.position.y - 20.5, N._Instance.Camera.transform.position.z - 36)),
                "YunHai" == this.owner.name && N._Instance.Camera && (this.owner.transform.position = new Laya.Vector3(N._Instance.Camera.transform.position.x, N._Instance.Camera.transform.position.y - 32, N._Instance.Camera.transform.position.z - 20.3)),
                0 != this.ReMoveMaxIndex && (this.ReMoveIndex++, this.ReMoveIndex >= this.ReMoveMaxIndex && D._Instance.recover(this.owner.name, this.owner))
        }
    }
    class L {
        static CreateBannerAndVideo() {
            this.CreateBannerAd1()
        }
        static CreateBannerAd1() {
            if (window.wx)
                for (let e = 0; e < this.BannerAdIdList.length; e++) {
                    let t = {};
                    t = 0 == e ? {
                        left: 0,
                        top: a.PhoneMsg.screenHeight,
                        width: 300
                    } : {
                        left: 0,
                        top: a.PhoneMsg.screenHeight,
                        width: a.PhoneMsg.screenWidth
                    };
                    let i = window.wx.createBannerAd({
                        adUnitId: this.BannerAdIdList[e],
                        style: t
                    });
                    i.onLoad(function() {
                            L.BannerAdList[e] = i,
                                L.BannerAdList[e].hide()
                        }),
                        i.onError(function(t) {
                            L.BannerAdList[e] = !1
                        }),
                        i.onResize(function(t) {
                            a.IsIphoneX ? 0 == e ? (i.style.top = a.PhoneMsg.screenHeight - 20 - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - 20 - t.height : 0 == e ? (i.style.top = a.PhoneMsg.screenHeight - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - t.height
                        })
                }
        }
        static CreateNewBannerAd(e) {
            if (window.wx) {
                let t = {};
                t = e == this.BannerAdIdList[0] ? {
                    left: 0,
                    top: a.PhoneMsg.screenHeight,
                    width: 300
                } : {
                    left: 0,
                    top: a.PhoneMsg.screenHeight,
                    width: a.PhoneMsg.screenWidth
                };
                let i = window.wx.createBannerAd({
                    adUnitId: e,
                    style: t
                });
                i.onLoad(function() {
                        switch (e) {
                            case L.BannerAdIdList[0]:
                                L.BannerAdList[0] = i,
                                    L.BannerAdList[0].hide();
                                break;
                            case L.BannerAdIdList[1]:
                                L.BannerAdList[1] = i,
                                    L.BannerAdList[1].hide();
                                break;
                            case L.BannerAdIdList[2]:
                                L.BannerAdList[2] = i,
                                    L.BannerAdList[2].hide();
                                break;
                            case L.BannerAdIdList[3]:
                                L.BannerAdList[3] = i,
                                    L.BannerAdList[3].hide()
                        }
                    }),
                    i.onError(function(e) {}),
                    i.onResize(function(t) {
                        a.IsIphoneX ? e == L.BannerAdIdList[0] ? (i.style.top = a.PhoneMsg.screenHeight - 20 - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - 20 - t.height : e == L.BannerAdIdList[0] ? (i.style.top = a.PhoneMsg.screenHeight - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - t.height
                    })
            }
        }
        static CreateRefreshBannerAd() {
            if (window.wx) {
                let e = window.wx.createBannerAd({
                    adUnitId: this.BannerAdIdList[0],
                    style: {
                        left: 0,
                        top: a.PhoneMsg.screenHeight,
                        width: 300
                    }
                });
                e.onLoad(function() {
                        L.BannerAdList[0].hide(),
                            L.BannerAdList[0] = e,
                            L.BannerAdList[0].show()
                    }),
                    e.onError(function(e) {}),
                    e.onResize(function(t) {
                        a.IsIphoneX ? (e.style.top = a.PhoneMsg.screenHeight - 20 - t.height, e.style.left = (a.PhoneMsg.screenWidth - e.style.width) / 2) : (e.style.top = a.PhoneMsg.screenHeight - t.height, e.style.left = (a.PhoneMsg.screenWidth - e.style.width) / 2)
                    })
            }
        }
        static CreateVideoAd(e, t, a) {
            if (i.IsCreateBanner && this.isPlay && (this.isPlay = !1, this.VideoAd ? this.isVideo = !0 : this.isVideo = !1, window.wx)) {
                let s = window.wx.createRewardedVideoAd({
                    adUnitId: e
                });
                s.onLoad(() => {
                        s.offLoad(),
                            this.VideoAd = s,
                            this.isVideo = !0
                    }),
                    s.onError(() => {
                        s.offError(),
                            this.isPlay = !0,
                            a ? a.run() : platform.getInstance().prompt("")
                    }),
                    s.load().then(() => s.show()).
                catch(e => {}),
                    Laya.timer.frameLoop(1, this,
                        function() {
                            this.isVideo && (Laya.timer.clearAll(this), this.isVideo = !1, this.VideoAd.show(), this.VideoAd.onClose(s => {
                                this.VideoAd.offClose(),
                                    this.isPlay = !0,
                                    s.isEnded ? (t && t.run(), "adunit-882eae0b76a4efe9" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        },
                                        {
                                            key: "check_point",
                                            value: i.MaxLevel
                                        }
                                    ]) : "adunit-7700c3c451d24475" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 4
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        },
                                        {
                                            key: "check_point",
                                            value: i.MaxLevel
                                        }
                                    ]) : "adunit-4c8e14b8ca44b3d3" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 3
                                        },
                                        {
                                            key: "event_code",
                                            value: 3
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-da8e666e88eaabf0" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 4
                                        },
                                        {
                                            key: "event_code",
                                            value: 3
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-4758a9cc8859992a" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 8
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-02ecb4e18e0f8aed" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 9
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-64a249d1bca08695" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 6
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-13d59607c9515428" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 12
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]) : "adunit-4020a99cce6ab6a1" == e && c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 9
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 4
                                        }
                                    ])) : (platform.getInstance().prompt(""), a && a.run(), "adunit-882eae0b76a4efe9" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        },
                                        {
                                            key: "check_point",
                                            value: i.MaxLevel
                                        }
                                    ]) : "adunit-7700c3c451d24475" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 4
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        },
                                        {
                                            key: "check_point",
                                            value: i.MaxLevel
                                        }
                                    ]) : "adunit-4c8e14b8ca44b3d3" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 3
                                        },
                                        {
                                            key: "event_code",
                                            value: 3
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-da8e666e88eaabf0" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 4
                                        },
                                        {
                                            key: "event_code",
                                            value: 3
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-4758a9cc8859992a" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 8
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-02ecb4e18e0f8aed" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 9
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-64a249d1bca08695" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 6
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-13d59607c9515428" == e ? c.SendMsgToServer([{
                                            key: "scene",
                                            value: 12
                                        },
                                        {
                                            key: "event_code",
                                            value: 2
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 2
                                        }
                                    ]) : "adunit-4020a99cce6ab6a1" == e && c.SendMsgToServer([{
                                            key: "scene",
                                            value: 1
                                        },
                                        {
                                            key: "event_code",
                                            value: 9
                                        },
                                        {
                                            key: "event_code_sub",
                                            value: 3
                                        }
                                    ]))
                            }))
                        })
            }
        }
        static CreateBannerAd(e) {
            if (i.IsCreateBanner) {
                this.HideAllBanner();
                let t = {};
                if (t = "adunit-0838107b25da5ad4" == e || "adunit-bee5766797443563" == e || "adunit-f494ab4604df0cb6" == e ? {
                        left: 0,
                        top: a.PhoneMsg.screenHeight,
                        width: 300
                    } : {
                        left: 0,
                        top: a.PhoneMsg.screenHeight,
                        width: a.PhoneMsg.screenWidth
                    },
                    window.wx) {
                    let i = window.wx.createBannerAd({
                        adUnitId: e,
                        style: t
                    });
                    i.onError(function(e) {
                            //console.log("banner广告加载失败！", e)
                        }),
                        i.onResize(function(t) {
                            a.IsIphoneX ? "adunit-0838107b25da5ad4" == e || "adunit-bee5766797443563" == e || "adunit-f494ab4604df0cb6" == e ? (i.style.top = a.PhoneMsg.screenHeight - 20 - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - 20 - t.height : "adunit-0838107b25da5ad4" == e || "adunit-bee5766797443563" == e || "adunit-f494ab4604df0cb6" == e ? (i.style.top = a.PhoneMsg.screenHeight - t.height, i.style.left = (a.PhoneMsg.screenWidth - i.style.width) / 2) : i.style.top = a.PhoneMsg.screenHeight - t.height
                        }),
                        i.onLoad(function() {
                            switch (e) {
                                case "adunit-0838107b25da5ad4":
                                    L.BannerShowData[0] && (L.StartBanner && L.StartBanner.hide(), L.StartBanner = i, L.StartBanner.show());
                                    break;
                                case "adunit-00c645a1e67dc641":
                                    L.BannerShowData[1] && (L.BuffBanner && L.BuffBanner.hide(), L.BuffBanner = i, L.BuffBanner.show());
                                    break;
                                case "adunit-22719a8a83b82420":
                                    L.BannerShowData[2] && (L.OverBanner && L.OverBanner.hide(), L.OverBanner = i, L.OverBanner.show());
                                    break;
                                case "adunit-c465d47c15eafdad":
                                    L.BannerShowData[3] && (L.SettleBanner && L.SettleBanner.hide(), L.SettleBanner = i, L.SettleBanner.show());
                                    break;
                                case "adunit-dbbf28f2c1bd0615":
                                    L.BannerShowData[4] && (L.LotteryBanner && L.LotteryBanner.hide(), L.LotteryBanner = i, L.LotteryBanner.show());
                                    break;
                                case "adunit-ed5606a607b8413e":
                                    L.BannerShowData[5] && (L.SignBanner && L.SignBanner.hide(), L.SignBanner = i, L.SignBanner.show());
                                    break;
                                case "adunit-139fc91faf13e7ff":
                                    L.BannerShowData[6] && (L.SkinBanner && L.SkinBanner.hide(), L.SkinBanner = i, L.SkinBanner.show());
                                    break;
                                case "adunit-f494ab4604df0cb6":
                                    L.BannerShowData[7] && (L.SkinShopBanner && L.SkinShopBanner.hide(), L.SkinShopBanner = i, L.SkinShopBanner.show());
                                    break;
                                case "adunit-16ffbe9e3d0b1682":
                                    L.BannerShowData[8] && (L.GetAwardBanner && L.GetAwardBanner.hide(), L.GetAwardBanner = i, L.GetAwardBanner.show());
                                    break;
                                case "adunit-7045d7763f9ea9e4":
                                    L.BannerShowData[9] && (L.SetBanner && L.SetBanner.hide(), L.SetBanner = i, L.SetBanner.show());
                                    break;
                                case "adunit-eb38c0440bf0b4de":
                                    L.BannerShowData[10] && (L.GetGoldBanner && L.GetGoldBanner.hide(), L.GetGoldBanner = i, L.GetGoldBanner.show());
                                    break;
                                case "adunit-e2cd7550b521e129":
                                    L.BannerShowData[11] && (L.GetPowerBanner && L.GetPowerBanner.hide(), L.GetPowerBanner = i, L.GetPowerBanner.show());
                                    break;
                                case "adunit-67969b1277a94d82":
                                    L.BannerShowData[12] && (L.GetDiamondBanner && L.GetDiamondBanner.hide(), L.GetDiamondBanner = i, L.GetDiamondBanner.show());
                                    break;
                                case "adunit-bee5766797443563":
                                    L.BannerShowData[13] && (L.RankBanner && L.RankBanner.hide(), L.RankBanner = i, L.RankBanner.show());
                                    break;
                                case "adunit-2a28850d40f9b47e":
                                    L.BannerShowData[14] && (L.TrySkinBanner && L.TrySkinBanner.hide(), L.TrySkinBanner = i, L.TrySkinBanner.show());
                                    break;
                                case "adunit-4f9c25c65d91cc0d":
                                    L.BannerShowData[15] && (L.MFSkinBanner && L.MFSkinBanner.hide(), L.MFSkinBanner = i, L.MFSkinBanner.show());
                                    break;
                                case "adunit-cf403df1370c0ec0":
                                    L.BannerShowData[16] && (L.BossShareBanner && L.BossShareBanner.hide(), L.BossShareBanner = i, L.BossShareBanner.show());
                                    break;
                                case "adunit-248ddfe90a55b858":
                                    L.BannerShowData[17] && (L.SettleShareBanner && L.SettleShareBanner.hide(), L.SettleShareBanner = i, L.SettleShareBanner.show());
                                    break;
                                case "adunit-42a7247d35ff1118":
                                    L.BannerShowData[18] && (L.ArenaMateBanner && L.ArenaMateBanner.hide(), L.ArenaMateBanner = i, L.ArenaMateBanner.show());
                                    break;
                                case "adunit-ea34ab94806411e1":
                                    L.BannerShowData[19] && (L.ArenaOverBanner && L.ArenaOverBanner.hide(), L.ArenaOverBanner = i, L.ArenaOverBanner.show());
                                    break;
                                case "adunit-9fc124558920a5ba":
                                    L.BannerShowData[20] && (L.ArenaSettleBanner && L.ArenaSettleBanner.hide(), L.ArenaSettleBanner = i, L.ArenaSettleBanner.show());
                                    break;
                                case "adunit-7e00d14681ff1741":
                                    L.BannerShowData[21] && (L.ArenaAwardBanner && L.ArenaAwardBanner.hide(), L.ArenaAwardBanner = i, L.ArenaAwardBanner.show());
                                    break;
                                case "adunit-daaedeb33e517be5":
                                    L.BannerShowData[22] && (L.OverExportBanner && L.OverExportBanner.hide(), L.OverExportBanner = i, L.OverExportBanner.show());
                                    break;
                                case "adunit-e5b692486d06346e":
                                    L.BannerShowData[23] && (L.SettleExportBanner && L.SettleExportBanner.hide(), L.SettleExportBanner = i, L.SettleExportBanner.show());
                                    break;
                                case "adunit-bff4443d7ff4c756":
                                    L.BannerShowData[24] && (L.ZuDuiBanner && L.ZuDuiBanner.hide(), L.ZuDuiBanner = i, L.ZuDuiBanner.show())
                            }
                        })
                }
            }
        }
        static CreateInterstitialAd(e) {
            if (i.IsCreateBanner && window.wx) {
                let t = window.wx.createInterstitialAd({
                    adUnitId: e
                });
                t.onLoad(() => {
                        switch (t.offLoad(), e) {
                            case "adunit-2ee06bee7c4fb32d":
                                L.StartInterstitialAd = t,
                                    L.IsShowStartInterstitialAd && L.StartInterstitialAd.show();
                                break;
                            case "adunit-5301ede4ea80c693":
                                L.GetAwardInterstitialAd = t,
                                    L.IsShowGetAwardInterstitialAd && L.GetAwardInterstitialAd.show();
                                break;
                            case "adunit-4412434ba3d4c013":
                                L.GiftInterstitialAd = t,
                                    L.IsShowGiftInterstitialAd && L.GiftInterstitialAd.show();
                                break;
                            case "adunit-0d94a2abf9cfe6b2":
                                L.BadgeLvInterstitialAd = t,
                                    L.IsShowBadgeLvInterstitialAd && L.BadgeLvInterstitialAd.show()
                        }
                    }),
                    t.onError(() => {
                        t.offError()
                        //console.log("插屏广告创建失败！")
                    })
            }
        }
        static HideAllBanner() {
            L.StartBanner && L.StartBanner.hide(),
                L.BuffBanner && L.BuffBanner.hide(),
                L.OverBanner && L.OverBanner.hide(),
                L.SettleBanner && L.SettleBanner.hide(),
                L.LotteryBanner && L.LotteryBanner.hide(),
                L.SignBanner && L.SignBanner.hide(),
                L.SkinBanner && L.SkinBanner.hide(),
                L.SkinShopBanner && L.SkinShopBanner.hide(),
                L.GetAwardBanner && L.GetAwardBanner.hide(),
                L.SetBanner && L.SetBanner.hide(),
                L.GetGoldBanner && L.GetGoldBanner.hide(),
                L.GetPowerBanner && L.GetPowerBanner.hide(),
                L.GetDiamondBanner && L.GetDiamondBanner.hide(),
                L.RankBanner && L.RankBanner.hide(),
                L.TrySkinBanner && L.TrySkinBanner.hide(),
                L.MFSkinBanner && L.MFSkinBanner.hide(),
                L.BossShareBanner && L.BossShareBanner.hide(),
                L.SettleShareBanner && L.SettleShareBanner.hide(),
                L.ArenaMateBanner && L.ArenaMateBanner.hide(),
                L.ArenaOverBanner && L.ArenaOverBanner.hide(),
                L.ArenaSettleBanner && L.ArenaSettleBanner.hide(),
                L.ArenaAwardBanner && L.ArenaAwardBanner.hide(),
                L.OverExportBanner && L.OverExportBanner.hide(),
                L.SettleExportBanner && L.SettleExportBanner.hide(),
                L.ZuDuiBanner && L.ZuDuiBanner.hide()
        }
    }
    L.BannerAdIdList = ["adunit-6b8af74dea331b28", "adunit-82323c7d985db17d", "adunit-3535f18ddedf9a11", "adunit-89e0750d188a516b"],
        L.BannerAdList = [],
        L.isPlay = !0,
        L.isVideo = !1,
        L.BannerShowData = [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0],
        L.IsShowStartInterstitialAd = !0,
        L.IsShowGetAwardInterstitialAd = !0,
        L.IsShowGiftInterstitialAd = !0,
        L.IsShowBadgeLvInterstitialAd = !0;
    class v extends e.Scene.GamePanelUI {
        constructor() {
            super(),
                this.IsShowPlayerKill = !1,
                this.IsShowEnemyKill = !1,
                this.IsShowDie = !1,
                this.GameRankData = [],
                this.BossHP = 100 / N._Instance.IsBossRemoveHp,
                this.BossMaxHP = 100,
                this.IsOpenUI = !1,
                this.HintTipsData = ["Upgrade skills to win from the start", "The volume skill can improve your attack", "The length skill can increase your attack scope"],
                this.PlayerTipsData = ["Grow longer to improve your attack！", "Grow bigger to improve your defense！", "Come on, beat me！", "Come here！", "Don't eat my meat, hum？", "Kill everyone and survive to the end."],
                this.PlayerArenaInitTipsData = ["Go!", "Destroy the your opponent's crystal！", "Work together！！！", "The territory is ours！", "Army to attack！"],
                this.PlayerArenaTipsData = ["I'll improve my skills later！", "Hit me!", "It's fun. I'll recommend friends later!", "Would I be more handsome if I changed my skin?", "Destroy the your opponent's crystal！", "The territory is ours！", "I envy those with high skill levels！", "Work together！！！"],
                this.EnemyTipsData = ["I'll wait for you here tomorrow!", "Come on, beat me!", "I've won five times already, who can beat me?", "I have recommended to my friends！", "Your attack is too low！", "My skill is already level 3, play with me？", "Kill everyone and survive to the end.", "After the speed upgrade, I walk like flying！", "Bye, rookie", "Your skin is so ugly. Get a new one!", "I envy those with high skill levels!"],
                this.EnemyArenaTipsData = ["Destroy the your opponent's crystal！", "The territory is ours！", "Upgrade the skills can help me win！", "My skill is already level 3, play with me？", "I envy those with high skill levels！"],
                this.Skeleton = new Laya.Skeleton
        }
        onAwake() {
            if (L.HideAllBanner(),
                v._Instance = this,
                s.MatchScreen(this, this.HintBg),
                s.MatchScreen(this, this.DieBg),
                s.AddBtnAnimation([this.wzdlbtn, this.ZdlBtn, this.homeBtn]),
                s.TopUIMatch(this.TopBox, 0),
                this.wzdlbtn.on(Laya.Event.CLICK, this, this.wzdl),
                this.ZdlBtn.on(Laya.Event.CLICK, this, this.zdl),
                this.homeBtn.on(Laya.Event.CLICK, this, this.HomeClick),
                N._Instance.IsLevelModel)
                this.PlayerPebbleTP.visible = !1,
                this.EnemyPebbleTP.visible = !1,
                this.IconLabel.text = "Lv",
                this.LevelTP.visible = !0,
                this.RoleTP.visible = !0,
                this.TimeTP.visible = !1,
                i.MaxLevel % 10 == 0 || 6 == i.MaxLevel ? this.BossTP.visible = !0 : this.BossTP.visible = !1,
                s.TopUIMatch(this.RankImage, 150),
                this.CountDownBox.visible = !1;
            else {
                this.PlayerPebbleTP.visible = !0,
                    this.EnemyPebbleTP.visible = !0,
                    this.IconLabel.text = "Avatar",
                    this.LevelTP.visible = !1,
                    this.RoleTP.visible = !1,
                    this.TimeTP.visible = !0,
                    this.BossTP.visible = !1;
                let e = N._Instance.PropBox;
                for (let t = 0; t < e.numChildren; t++) {
                    let a = e.getChildAt(t);
                    if ("PlayerPebble" == a.name) {
                        a.getComponent(k).SetPebbleTP(!0)
                    } else if ("EnemyPebble" == a.name) {
                        a.getComponent(k).SetPebbleTP(!1)
                    }
                }
                this.RankImage.pos(619, 370),
                    s.TopUIMatch(this.RankImage, 220),
                    this.CountDownBox.visible = !0,
                    s.TopUIMatch(this.CountDownBox, 250)
            }
            if (this.wzdlbtn.visible = !1, 1 == i.MaxLevel && Laya.timer.once(1500, this, () => {
                    this.wzdlbtn.visible = !0,
                        this.HintBg.on(Laya.Event.CLICK, this, this.wzdl)
                }), N._Instance.IsCreateHint) N._Instance.IsHint = !0,
                this.CreateHint(),
                N._Instance.IsLevelModel && 1 == i.MaxLevel || this.HintBg.on(Laya.Event.CLICK, this, this.CloseHintBg);
            else if (N._Instance.Camera.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.getChildAt(0).transform.position.y + 15, N._Instance.Player.transform.position.z + 15), N._Instance.IsHint = !1, this.HintBg.visible = !1, this.Hint1Box.visible = !1, this.Hint2Box.visible = !1, this.Hint3Box.visible = !1, this.HintTipsLabel.visible = !1, this.wzdlbtn.visible = !1, this.HintBg && this.HintBg.destroy(), this.Hint1Box && this.Hint1Box.destroy(), this.Hint2Box && this.Hint2Box.destroy(), this.Hint3Box && this.Hint3Box.destroy(), this.HintTipsLabel && this.HintTipsLabel.destroy(), this.wzdlbtn && this.wzdlbtn.destroy(), this.PropertyIconCtrl(!0), !N._Instance.IsLevelModel) {
                let e = Math.floor(N._Instance.CountDownTime % 3600);
                this.TimeLabel.text = "剩余时间：" + o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(N._Instance.CountDownTime % 60)
            }
            N._Instance.Player && (this.PlayerCtrl = N._Instance.Player.getComponent(_)),
                Laya.timer.frameLoop(1, this, this.Update),
                this.RemoveuselessModule(),
                N._Instance.LoadEffectRes()
        }
        CloseHintBg() {
            switch (n.PlaySound("click"), Laya.timer.clear(this, this.StartGame), this.StartGame(), N._Instance.OpenGamePanelType) {
                case 1:
                    N._Instance.LevelModleStartGame();
                    break;
                case 2:
                    N._Instance.LevelModleRevive();
                    break;
                case 3:
                    N._Instance.ArenaModleStartGame();
                    break;
                case 4:
                    N._Instance.ArenaModleRevive()
            }
            this.OpenUI()
        }
        HomeClick() {
            N._Instance.ArenaStopGame(),
                N._Instance.ReGame(),
                N._Instance.IsStopGame = true,
                N._Instance.IsOver = true,
                n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene");
        }
        wzdl() {
            n.PlaySound("click"),
                this.Hint1Box.visible = !1,
                this.Hint2Box.visible = !1;
            let e = new Laya.Skeleton;
            this.Hint3Box.addChild(e),
                e.pos(0, 100),
                e.scale(.8, .8),
                e.load("res/UIEffect/HintEffect/ShuaiWei/sonshou.sk", new Laya.Handler(this, () => {
                        e.play(1, !0)
                    },
                    null, !0)),
                this.wzdlbtn.visible = !1,
                this.wzdlbtn.bottom = 400,
                this.HintBg.off(Laya.Event.CLICK, this, this.wzdl),
                this.wzdlbtn.off(Laya.Event.CLICK, this, this.wzdl),
                Laya.timer.once(1500, this, this.OpenAni)
        }
        zdl() {
            n.PlaySound("click"),
                this.DieBg.visible = !1,
                this.DieTips.visible = !1,
                N._Instance.IsDieHit = !1,
                N._Instance.Player.getComponent(_).IsGod = !1;
            for (let e = 0; e < Laya.stage.numChildren; e++) "Property" == Laya.stage.getChildAt(e).name && (Laya.stage.getChildAt(e).visible = !0),
                "CountDownLabel" == Laya.stage.getChildAt(e).name && (Laya.stage.getChildAt(e).visible = !0)
        }
        OpenAni() {
            this.wzdlbtn.visible = !0,
                this.HintBg.on(Laya.Event.CLICK, this, this.CloseHintBg),
                this.wzdlbtn.on(Laya.Event.CLICK, this, this.CloseHintBg)
        }
        onEnable() {}
        onOpened(e) {
            e && 1 == e[0] && (this.IsOpenUI = !0)
        }
        OpenUI() {
            console.log("GameRankData:", N._Instance.GameRankData),
                this.GameRankSet(N._Instance.GameRankData)
        }
        Update() {
            if (N._Instance.PlayerKillData.length > 0 && !this.IsShowPlayerKill && (this.IsShowPlayerKill = !0, this.OpenPlayerKillTP()), N._Instance.PlayerKillData.length <= 0 && N._Instance.DieData.length > 0 && !this.IsShowDie && (this.IsShowDie = !0, this.IsShowPlayerKill = !0, this.OpenDieTP()), N._Instance.EnemyKillData.length > 0 && !this.IsShowEnemyKill && (this.IsShowEnemyKill = !0, this.OpenEnemyKillTP()), N._Instance.IsLevelModel) {
                if (this.LevelLabel.text = i.MaxLevel.toString(),
                    i.MaxLevel % 10 == 0 || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel || 4 == i.MaxLevel || 6 == i.MaxLevel || (
                        this.RankImage.visible = !0,
                        this.RoleLabel.text = "People:" + (N._Instance.EnemyBox.numChildren + N._Instance.PlayerNum)),
                    i.MaxLevel % 10 == 0 || 6 == i.MaxLevel) {
                    let e = 500 / this.BossMaxHP;
                    this.BossHpTP.width = this.BossHP * e,
                        this.BossHP <= 0 && (this.BossTP.visible = !1)
                }
            } else this.RankImage.visible = !0;
            if (!this.PlayerCtrl || this.PlayerCtrl.IsDie || 4 == i.MaxLevel || 6 == i.MaxLevel || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel || i.MaxLevel % 10 == 0 ? (this.PlayerTipsIcon.visible = !1, this.PlayerTipsIcon.pos(1e4, 1e4)) : (this.PlayerTipsIcon.visible = !0, this.PlayerTipsIcon.pos(this.PlayerCtrl.TipsIconPos.x, this.PlayerCtrl.TipsIconPos.y)), !this.EnemyCtrl || this.EnemyCtrl.IsDie || 4 == i.MaxLevel || 6 == i.MaxLevel || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel || i.MaxLevel % 10 == 0 ? (this.EnemyTipsIcon.visible = !1, this.EnemyTipsIcon.pos(1e4, 1e4)) : (this.EnemyTipsIcon.visible = !0, this.EnemyTipsIcon.pos(this.EnemyCtrl.TipsIconPos.x, this.EnemyCtrl.TipsIconPos.y)), N._Instance.IsLevelModel || (this.Enemy1Ctrl && !this.Enemy1Ctrl.IsDie ? (this.Enemy1TipsIcon.visible = !0, this.Enemy1TipsIcon.pos(this.Enemy1Ctrl.TipsIconPos.x, this.Enemy1Ctrl.TipsIconPos.y)) : (this.Enemy1TipsIcon.visible = !1, this.Enemy1TipsIcon.pos(1e4, 1e4)), this.Team1Ctrl && !this.Team1Ctrl.IsDie ? (this.Team1TipsIcon.visible = !0, this.Team1TipsIcon.pos(this.Team1Ctrl.TipsIconPos.x, this.Team1Ctrl.TipsIconPos.y)) : (this.Team1TipsIcon.visible = !1, this.Team1TipsIcon.pos(1e4, 1e4)), this.Team2Ctrl && !this.Team2Ctrl.IsDie ? (this.Team2TipsIcon.visible = !0, this.Team2TipsIcon.pos(this.Team2Ctrl.TipsIconPos.x, this.Team2Ctrl.TipsIconPos.y)) : (this.Team2TipsIcon.visible = !1, this.Team2TipsIcon.pos(1e4, 1e4))), !N._Instance.IsLevelModel) {
                let e = Math.floor(N._Instance.CountDownTime % 3600);
                this.TimeLabel.text = "Time:" + o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(N._Instance.CountDownTime % 60)
            }
        }
        BossXTTween(e) {
            Laya.Tween.clearAll(this.BossHpDTTP);
            let t = e * (500 / this.BossMaxHP);
            Laya.Tween.to(this.BossHpDTTP, {
                    width: t
                },
                500, null)
        }
        GameRankSet(e) {
            (this && this.GameList && N._Instance.IsLevelModel && i.MaxLevel % 10 != 0 && (i.MaxLevel % 10 != 7 || 7 == i.MaxLevel) && 4 != i.MaxLevel && 6 != i.MaxLevel || !N._Instance.IsLevelModel) && (this.GameList.itemRender = I, this.GameRankData = this.sortFun(e), this.GameList.array = this.GameRankData, this.GameList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1))
        }
        freshList1(e, t) {
            e.setShow(this.GameRankData[t])
        }
        sortFun(e) {
            if (N._Instance.IsLevelModel) e.sort(function(e, t) {
                if (e.islive < t.islive) return 1;
                if (e.islive > t.islive) return -1;
                if (e.islive == t.islive) {
                    if (e.killnum > t.killnum) return -1;
                    if (e.killnum < t.killnum) return 1;
                    if (e.killnum == t.killnum) return e.dietime > t.dietime ? -1 : e.dietime < t.dietime ? 1 : 0
                }
            });
            else
                for (var t = 0; t < e.length - 1; t++)
                    for (var a = 0; a < e.length - 1 - t; a++)
                        if (e[a].killnum < e[a + 1].killnum) {
                            var i = e[a];
                            e[a] = e[a + 1],
                                e[a + 1] = i
                        }
            for (t = 0; t < e.length; t++) e[t].rank = t + 1;
            return e
        }
        CreateHint() {
            if (N._Instance.IsLevelModel)
                if (1 == i.MaxLevel) {
                    let e = new Laya.Skeleton;
                    this.Hint1Box.addChild(e),
                        e.pos(0, 0),
                        e.scale(.8, .8),
                        e.load("res/UIEffect/HintEffect/DianJi/dierge.sk", new Laya.Handler(this, () => {
                                e.play(0, !0)
                            },
                            null, !0)),
                        this.Hint2Box.centerY = 200;
                    let t = new Laya.Skeleton;
                    this.Hint2Box.addChild(t),
                        t.pos(0, 0),
                        t.scale(.8, .8),
                        t.load("res/UIEffect/HintEffect/LuoShui/diaoshui.sk", new Laya.Handler(this, () => {
                                t.play(0, !0)
                            },
                            null, !0))
                } else if (7 == i.MaxLevel || 4 != i.MaxLevel && i.MaxLevel % 10 != 7) {
                let e = new Laya.Skeleton;
                this.Hint1Box.addChild(e),
                    e.pos(0, 0),
                    e.scale(.8, .8),
                    e.load("res/UIEffect/HintEffect/HuaDong/shuai.sk", new Laya.Handler(this, () => {
                            e.play(0, !0)
                        },
                        null, !0));
                let t = new Laya.Skeleton;
                this.Hint2Box.addChild(t),
                    6 == i.MaxLevel || i.MaxLevel % 10 == 0 ? (t.pos(0, 0), t.scale(.8, .8), t.load("res/UIEffect/HintEffect/DaBoss/jisui.sk", new Laya.Handler(this, () => {
                            t.play(1, !0)
                        },
                        null, !0))) : (t.pos(0, 0), t.scale(.8, .8), t.load("res/UIEffect/HintEffect/ShuaiWei/sonshou.sk", new Laya.Handler(this, () => {
                            t.play(1, !0)
                        },
                        null, !0)))
            } else {
                let e = new Laya.Skeleton;
                this.Hint3Box.addChild(e),
                    e.pos(0, 0),
                    e.scale(.8, .8),
                    e.load("res/UIEffect/HintEffect/EatGold/chijngbi.sk", new Laya.Handler(this, () => {
                            e.play(0, !0)
                        },
                        null, !0))
            } else {
                let e = new Laya.Skeleton;
                this.Hint3Box.addChild(e),
                    e.pos(0, 200),
                    e.scale(1, 1),
                    e.load("res/UIEffect/HintEffect/Arena/jididan.sk", new Laya.Handler(this, () => {
                            e.play(0, !0)
                        },
                        null, !0)),
                    this.HintTipsLabel.visible = !1;
                // this.HintTipsLabel.text = o.GetDataRandom({
                // 	arry: this.HintTipsData,
                // 	range: 1
                // })[0]
            }
            1 == i.MaxLevel && 1 == N._Instance.OpenGamePanelType || Laya.timer.once(N._Instance.StartDelay, this, this.StartGame)
        }
        StartGame() {
            if (N._Instance.StartDelay = 3e3,
                N._Instance.IsHint = !1,
                this.HintBg.visible = !1,
                this.Hint1Box.visible = !1,
                this.Hint2Box.visible = !1,
                this.Hint3Box.visible = !1,
                this.HintTipsLabel.visible = !1,
                this.wzdlbtn.visible = !1,
                this.HintBg && this.HintBg.destroy(),
                this.Hint1Box && this.Hint1Box.destroy(),
                this.Hint2Box && this.Hint2Box.destroy(),
                this.Hint3Box && this.Hint3Box.destroy(),
                this.HintTipsLabel && this.HintTipsLabel.destroy(),
                this.wzdlbtn && this.wzdlbtn.destroy(),
                Laya.timer.clear(this, this.OpenAni),
                this.PropertyIconCtrl(!0), !N._Instance.IsLevelModel) {
                let e = Math.floor(N._Instance.CountDownTime % 3600);
                this.TimeLabel.text = "Time：" + o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(N._Instance.CountDownTime % 60)
            }
            this.IsOpenUI && this.OpenUI()
        }
        PropertyIconCtrl(e) {
            for (let t = 0; t < Laya.stage.numChildren; t++) "Property" == Laya.stage.getChildAt(t).name && (Laya.stage.getChildAt(t).visible = e),
                "CountDownLabel" == Laya.stage.getChildAt(t).name && (Laya.stage.getChildAt(t).visible = e);
            e && (N._Instance.IsLevelModel && (4 == i.MaxLevel || 6 == i.MaxLevel || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel || i.MaxLevel % 10 == 0) || this.OpenTipsIcon())
        }
        OpenTipsIcon() {
            this.OpenEnemyTipsIcon(),
                N._Instance.IsOneOpenTips ? (this.OpenPlayerTipsIcon(!1), N._Instance.IsLevelModel || this.OpenTeamTipsIcon(!1)) : (N._Instance.IsOneOpenTips = !0, this.OpenPlayerTipsIcon(!0), N._Instance.IsLevelModel || this.OpenTeamTipsIcon(!0))
        }
        OpenPlayerTipsIcon(e) {
            let t = "越长越能打！";
            (t = N._Instance.IsLevelModel ? o.GetDataRandom({
                arry: this.PlayerTipsData,
                range: 1
            })[0] : e ? o.GetDataRandom({
                arry: this.PlayerArenaInitTipsData,
                range: 1
            })[0] : o.GetDataRandom({
                arry: this.PlayerArenaTipsData,
                range: 1
            })[0]).length >= 9 ? this.PlayerTipsLabel.align = "left" : this.PlayerTipsLabel.align = "center",
                this.PlayerTipsLabel.text = t,
                Laya.Tween.to(this.PlayerTipsIcon, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut),
                Laya.timer.once(3e3, this, this.ClosePlayerTipsIcon)
        }
        ClosePlayerTipsIcon() {
            Laya.Tween.to(this.PlayerTipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.timer.once(1e3 * Math.round(5 * Math.random() + 5), this, this.OpenPlayerTipsIcon, [!1])
        }
        OpenEnemyTipsIcon() {
            this.EnemyCtrl = null,
                this.Enemy1Ctrl = null;
            let e = [];
            for (let t = 0; t < N._Instance.EnemyBox.numChildren; t++) {
                let a = N._Instance.EnemyBox.getChildAt(t).getComponent(T),
                    i = {};
                N._Instance.IsLevelModel ? (i.obj = N._Instance.EnemyBox.getChildAt(t), i.dir = Laya.Vector3.distance(N._Instance.Player.transform.position, N._Instance.EnemyBox.getChildAt(t).transform.position), e.push(i)) : a.IsTeam || (i.obj = N._Instance.EnemyBox.getChildAt(t), i.dir = Laya.Vector3.distance(N._Instance.Player.transform.position, N._Instance.EnemyBox.getChildAt(t).transform.position), e.push(i))
            }
            for (var t = 0; t < e.length - 1; t++)
                for (var a = 0; a < e.length - 1 - t; a++)
                    if (e[a].dir > e[a + 1].dir) {
                        var i = e[a];
                        e[a] = e[a + 1],
                            e[a + 1] = i
                    }
            if (e && e.length > 0) {
                for (let t = 0; t < e.length; t++) {
                    if (e[t]) {
                        if (0 == t) {
                            this.EnemyCtrl = e[t].obj.getComponent(T);
                            let a = "I'll wait for you here tomorrow!";
                            (a = N._Instance.IsLevelModel ? Math.random() > .5 ? "I'll wait for you here tomorrow!" : o.GetDataRandom({
                                arry: this.EnemyTipsData,
                                range: 1
                            })[0] : o.GetDataRandom({
                                arry: this.EnemyArenaTipsData,
                                range: 1
                            })[0]).length >= 9 ? this.EnemyTipsLabel.align = "left" : this.EnemyTipsLabel.align = "center",
                                this.EnemyTipsLabel.text = a,
                                Laya.Tween.to(this.EnemyTipsIcon, {
                                        scaleX: 1,
                                        scaleY: 1
                                    },
                                    500, Laya.Ease.backOut)
                        }
                        if (1 == t && !N._Instance.IsLevelModel) {
                            this.Enemy1Ctrl = e[t].obj.getComponent(T);
                            let a = o.GetDataRandom({
                                arry: this.EnemyArenaTipsData,
                                range: 1
                            })[0];
                            a.length >= 9 ? this.Enemy1TipsLabel.align = "left" : this.Enemy1TipsLabel.align = "center",
                                this.Enemy1TipsLabel.text = a,
                                Laya.Tween.to(this.Enemy1TipsIcon, {
                                        scaleX: 1,
                                        scaleY: 1
                                    },
                                    500, Laya.Ease.backOut)
                        }
                    }
                    if (t >= 2) break
                }
                Laya.timer.once(3e3, this, this.CloseEnemyTipsIcon)
            }
        }
        CloseEnemyTipsIcon() {
            Laya.Tween.to(this.EnemyTipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.Tween.to(this.Enemy1TipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.timer.once(1e3 * Math.round(10 * Math.random() + 5), this, this.OpenEnemyTipsIcon)
        }
        OpenTeamTipsIcon(e) {
            this.Team1Ctrl = null,
                this.Team2Ctrl = null;
            let t = [],
                a = [],
                i = [],
                s = [];
            for (let t = 0; t < N._Instance.EnemyBox.numChildren; t++) {
                let n = N._Instance.EnemyBox.getChildAt(t);
                if (n) {
                    let o = n.getComponent(T);
                    if (e) o && o.IsTeam && n.transform.position.x > N._Instance.Player.transform.position.x && i.push(N._Instance.EnemyBox.getChildAt(t)),
                        o && o.IsTeam && n.transform.position.x < N._Instance.Player.transform.position.x && s.push(N._Instance.EnemyBox.getChildAt(t));
                    else if (o && o.IsTeam) {
                        let e = {};
                        e.obj = N._Instance.EnemyBox.getChildAt(t),
                            e.dir = Laya.Vector3.distance(N._Instance.Player.transform.position, N._Instance.EnemyBox.getChildAt(t).transform.position),
                            a.push(e)
                    }
                }
            }
            if (e) t.push(o.GetDataRandom({
                    arry: i,
                    range: 1
                })[0]),
                t.push(o.GetDataRandom({
                    arry: s,
                    range: 1
                })[0]);
            else {
                for (var n = 0; n < a.length - 1; n++)
                    for (var r = 0; r < a.length - 1 - n; r++)
                        if (a[r].dir > a[r + 1].dir) {
                            var l = a[r];
                            a[r] = a[r + 1],
                                a[r + 1] = l
                        }
                for (let e = 0; e < a.length; e++) t.push(a[e].obj)
            }
            if (t && t.length > 0)
                for (let a = 0; a < t.length; a++)
                    if (t[a]) {
                        let i = "冲鸭...";
                        i = e ? o.GetDataRandom({
                                arry: this.PlayerArenaInitTipsData,
                                range: 1
                            })[0] : o.GetDataRandom({
                                arry: this.EnemyArenaTipsData,
                                range: 1
                            })[0],
                            0 == a ? (this.Team1Ctrl = t[a].getComponent(T), i.length >= 9 ? this.Team1TipsLabel.align = "left" : this.Team1TipsLabel.align = "center", this.Team1TipsLabel.text = i, Laya.Tween.to(this.Team1TipsIcon, {
                                    scaleX: 1,
                                    scaleY: 1
                                },
                                500, Laya.Ease.backOut)) : 1 == a && (this.Team2Ctrl = t[a].getComponent(T), i.length >= 9 ? this.Team2TipsLabel.align = "left" : this.Team2TipsLabel.align = "center", this.Team2TipsLabel.text = i, Laya.Tween.to(this.Team2TipsIcon, {
                                    scaleX: 1,
                                    scaleY: 1
                                },
                                500, Laya.Ease.backOut))
                    }
            Laya.timer.once(3e3, this, this.CloseTeamTipsIcon)
        }
        CloseTeamTipsIcon() {
            Laya.Tween.to(this.Team1TipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.Tween.to(this.Team2TipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.timer.once(1e3 * Math.round(10 * Math.random() + 5), this, this.OpenTeamTipsIcon, [!1])
        }
        OpenPlayerKillTP() {
            this.PlayerKillTP.visible = !0,
                (i.MaxLevel % 10 != 0 && 6 != i.MaxLevel || !N._Instance.IsLevelModel) && (this.PlayerKillIcon.skin = N._Instance.PlayerKillData[0].beatkicon, this.PlayerKillBadgeIcon.skin = "res/Icon/Badge/Badge_0" + N._Instance.PlayerKillData[0].beatkbadge + ".png", Laya.Tween.to(this.PlayerKillTP, {
                        x: -30
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                        Laya.timer.once(1e3, this, () => {
                            Laya.Tween.to(this.PlayerKillTP, {
                                    x: -297
                                },
                                500, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                    N._Instance.PlayerKillData.splice(0, 1),
                                        this.IsShowPlayerKill = !1,
                                        this.PlayerKillTP.visible = !1
                                }))
                        })
                    })))
        }
        OpenEnemyKillTP() {
            this.EnemyKillTp.visible = !0,
                (i.MaxLevel % 10 != 0 && 6 != i.MaxLevel || !N._Instance.IsLevelModel) && (this.Kill2Icon.skin = N._Instance.EnemyKillData[0].beatkicon, this.Kill2NameLabel.text = N._Instance.EnemyKillData[0].beatkname, this.Kill1Icon.skin = N._Instance.EnemyKillData[0].atkicon, this.Kill1NameLabel.text = N._Instance.EnemyKillData[0].atkname, Laya.Tween.to(this.EnemyKillTp, {
                        x: -80
                    },
                    800, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                        Laya.timer.once(1e3, this, () => {
                            Laya.Tween.to(this.EnemyKillTp, {
                                    x: -507
                                },
                                800, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                    N._Instance.EnemyKillData.splice(0, 1),
                                        this.IsShowEnemyKill = !1,
                                        this.EnemyKillTp.visible = !1
                                }))
                        })
                    })))
        }
        OpenDieTP() {
            this.DieTp.visible = !0,
                (i.MaxLevel % 10 == 0 || 6 == i.MaxLevel || 4 == i.MaxLevel || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel) && N._Instance.IsLevelModel || (this.DieIcon.skin = N._Instance.DieData[0].dieicon, this.DieBadgeIcon.skin = "res/Icon/Badge/Badge_0" + N._Instance.DieData[0].diebadge + ".png", Laya.Tween.to(this.DieTp, {
                        x: -30
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                        Laya.timer.once(1e3, this, () => {
                            Laya.Tween.to(this.DieTp, {
                                    x: -297
                                },
                                500, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                    N._Instance.DieData.splice(0, 1),
                                        this.IsShowDie = !1,
                                        this.IsShowPlayerKill = !1,
                                        this.DieTp.visible = !1
                                }))
                        })
                    })))
        }
        OpenKillIcon(e) {
            if (i.MaxLevel % 10 != 0 && 6 != i.MaxLevel || !N._Instance.IsLevelModel) {
                switch (Laya.Tween.clearAll(this.KillTP), this.KillTP.visible = !1, this.KillTP.visible = !0, this.KillTP.scale(0, 0), this.KillLabel.value = e, e <= 9 ? (this.KillLabel.x = 70, this.shatp.x = 165) : (this.KillLabel.x = 102, this.shatp.x = 202), n.PlaySound("kill"), e >= 7 ? n.PlaySound("kill7") : n.PlaySound("kill" + e), e) {
                    case 3:
                        this.Kill3TP.visible = !0,
                            this.Kill5TP.visible = !1,
                            this.Kill8TP.visible = !1;
                        break;
                    case 5:
                        this.Kill3TP.visible = !1,
                            this.Kill5TP.visible = !0,
                            this.Kill8TP.visible = !1
                }
                e >= 7 && (this.Kill3TP.visible = !1, this.Kill5TP.visible = !1, this.Kill8TP.visible = !0),
                    Laya.Tween.to(this.KillTP, {
                            scaleX: 1,
                            scaleY: 1
                        },
                        300, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                            Laya.timer.once(500, this, () => {
                                Laya.Tween.to(this.KillTP, {
                                        scaleX: 0,
                                        scaleY: 0
                                    },
                                    300, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                        this.KillTP.scale(0, 0),
                                            this.KillTP.visible = !1,
                                            this.Kill3TP.visible = !1,
                                            this.Kill5TP.visible = !1,
                                            this.Kill8TP.visible = !1
                                    }))
                            })
                        }))
            }
        }
        OpenWinTP() {
            N._Instance.IsWin = !0,
                this.WinTP.visible = !1,
                this.WinTP.scale(0, 0),
                this.WinTP.visible = !0,
                Laya.Tween.to(this.WinTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    300, Laya.Ease.backOut)
        }
        TwoPointRotation3D(e, t) {
            t.x -= e.x,
                t.z -= e.z;
            var a = 0;
            if (0 == t.x && 0 == t.z) return 0;
            if (t.x > 0 && t.z > 0) a = 0;
            else {
                if (t.x > 0 && 0 == t.z) return 90;
                if (t.x > 0 && t.z < 0) a = 180;
                else {
                    if (0 == t.x && t.z < 0) return 180;
                    if (t.x < 0 && t.z < 0) a = -180;
                    else {
                        if (t.x < 0 && 0 == t.z) return -90;
                        t.x < 0 && t.z > 0 && (a = 0)
                    }
                }
            }
            return Math.atan(t.x / t.z) * (360 / (2 * Math.PI)) + a
        }
        CountTimerLabelTween() {
            Laya.Tween.to(this.DownCountLabel, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                300, null, Laya.Handler.create(this, this.CountTimerLabelTween1))
        }
        CountTimerLabelTween1() {
            Laya.Tween.to(this.DownCountLabel, {
                    scaleX: 1,
                    scaleY: 1
                },
                300, null)
        }
        OverGameTPTween() {
            this.djstp.visible = !1,
                this.DownCountLabel.visible = !1,
                Laya.Tween.to(this.OverGameTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    300, Laya.Ease.backOut)
        }
        RemoveuselessModule() {
            N._Instance.IsLevelModel ? (i.MaxLevel % 10 == 0 || 6 == i.MaxLevel ? (this.RankImage.destroy(), this.DieTp.destroy(), this.PlayerKillTP.destroy(), this.EnemyKillTp.destroy(), this.KillTP.destroy(), this.EnemyTipsIcon.destroy(), this.PlayerTipsIcon.destroy()) : 7 == i.MaxLevel || i.MaxLevel % 10 != 7 && 4 != i.MaxLevel ? this.BossTP.destroy() : (this.RankImage.destroy(), this.DieTp.destroy(), this.PlayerKillTP.destroy(), this.EnemyKillTp.destroy(), this.KillTP.destroy(), this.EnemyTipsIcon.destroy(), this.PlayerTipsIcon.destroy(), this.BossTP.destroy()), this.PlayerPebbleTP.destroy(), this.EnemyPebbleTP.destroy(), this.PlayerPebbleZYTP.destroy(), this.EnemyPebbleZYTP.destroy(), this.Enemy1TipsIcon.destroy(), this.Team1TipsIcon.destroy(), this.Team2TipsIcon.destroy()) : (this.LevelTP.destroy(), this.BossTP.destroy())
        }
        onDisable() {
            Laya.timer.clearAll(this),
                this.PropertyIconCtrl(!1)
        }
    }
    class I extends e.Scene.GameItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (N._Instance.IsLevelModel ? 1 == e.isself ? (this.Bg.visible = !0, this.NameLabel.color = "#E50000", this.KillLabel.color = "#E50000") : (this.Bg.visible = !1, this.NameLabel.color = "#F0F7FF", this.KillLabel.color = "#F0F7FF") : e.isteam ? (1 == e.isself ? this.Bg.visible = !0 : this.Bg.visible = !1, this.NameLabel.color = "#27ff00", this.KillLabel.color = "#27ff00") : (this.Bg.visible = !1, this.NameLabel.color = "#ff0a00", this.KillLabel.color = "#ff0a00"), e.rank <= 3 && (this.RankIcon.skin = "res/Icon/Rank/No" + e.rank + ".png"), N._Instance.IsLevelModel ? (this.kuangbg.visible = !1, this.Icon.visible = !1, this.BadgeIcon.visible = !0, this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png", this.BadgeLabel.text = i.BadgeData[e.badge - 1]) : (this.kuangbg.visible = !0, this.Icon.visible = !0, this.Icon.skin = e.head, this.BadgeIcon.visible = !1, this.BadgeLabel.visible = !1), this.NameLabel.text = e.name, this.KillLabel.text = e.killnum.toString())
        }
    }
    class w extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner
        }
        onUpdate() {
            "Gold" != this.owner.name && "ZuanShi" != this.owner.name && "SuiPian" != this.owner.name || this.owner.transform.rotate(new Laya.Vector3(0, .05, 0), !1)
        }
    }
    class u {
        static MoveTo(e, t, a, i, s, n = 0, o = !0, r, l) {
            let h = e.transform.position.clone();
            if (0 == a || null == a) return void(e.transform.position = t.clone());
            (l <= 0 || null == l) && (l = this.frame);
            let c = function() {
                e.transform && (e.transform.position = h),
                    r && r()
            };
            Laya.timer.once(n, e,
                function() {
                    Laya.timer.frameLoop(l, e, c)
                });
            let d = Laya.Tween.to(h, {
                    x: t.x,
                    y: t.y,
                    z: t.z
                },
                a, i, Laya.Handler.create(e,
                    function() {
                        e.transform && (e.transform.position = t.clone(), Laya.timer.clear(e, c)),
                            s && s.run()
                    }), n, o);
            this.tweenMap[e.id] || (this.tweenMap[e.id] = []),
                this.tweenMap[e.id].push(d)
        }
        static RotateTo(e, t, a, i, s, n, o, r, l) {
            let h = e.transform.rotationEuler.clone();
            if (0 == a || null == a) return void(e.transform.rotationEuler = t.clone());
            (l <= 0 || null == l) && (l = this.frame);
            let c = function() {
                e.transform && (e.transform.rotationEuler = h),
                    r && r()
            };
            Laya.timer.once(n, e,
                function() {
                    Laya.timer.frameLoop(l, e, c)
                });
            let d = Laya.Tween.to(h, {
                    x: t.x,
                    y: t.y,
                    z: t.z
                },
                a, i, Laya.Handler.create(e,
                    function() {
                        e.transform && (e.transform.rotationEuler = t.clone(), Laya.timer.clear(e, c)),
                            s && s.run()
                    }), n, o);
            this.tweenMap[e.id] || (this.tweenMap[e.id] = []),
                this.tweenMap[e.id].push(d)
        }
        static ScaleTo(e, t, a, i, s, n, o, r, l, h) {
            let c = e.transform.localScale.clone();
            if (0 == a || null == a) return e.transform.localScale = t.clone(),
                void(n && n.apply(i));
            (h <= 0 || null == h) && (h = this.frame);
            let d = function() {
                e.transform.localScale = c.clone(),
                    l && l()
            };
            Laya.timer.once(o, this,
                function() {
                    Laya.timer.frameLoop(h, e, d)
                });
            let p = Laya.Tween.to(c, {
                    x: t.x,
                    y: t.y,
                    z: t.z
                },
                a, s, Laya.Handler.create(e,
                    function() {
                        e.transform.localScale = t.clone(),
                            Laya.timer.clear(e, d),
                            n && n.apply(i)
                    }), o, r);
            this.tweenMap[e.id] || (this.tweenMap[e.id] = []),
                this.tweenMap[e.id].push(p)
        }
        static ClearTween(e) {
            let t = this.tweenMap[e.id];
            if (t && t.length)
                for (; t.length > 0;) {
                    t.pop().clear()
                }
            Laya.timer.clearAll(e)
        }
    }
    u.tweenMap = {},
        u.frame = 1;
    class g extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.InitPos = new Laya.Vector3(0, 0, 0)
        }
        onAwake() {}
        onUpdate() {
            if (N._Instance.Player && N._Instance.IsCameraMove) {
                let e,
                    t = new Laya.Vector3(0, 0, 0);
                e = N._Instance.IsLevelModel ? new Laya.Vector3(N._Instance.Player.transform.position.x - 10, N._Instance.Player.getChildAt(0).transform.position.y + 15, N._Instance.Player.transform.position.z + 10) : new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.getChildAt(0).transform.position.y + 15, N._Instance.Player.transform.position.z + 15),
                    Laya.Vector3.lerp(this.owner.transform.position, e, .5, t),
                    this.owner.transform.position = t
            }
        }
        CameraTween() {
            u.ClearTween(this.owner),
                u.MoveTo(this.owner, new Laya.Vector3(this.InitPos.x + .3, this.InitPos.y, this.InitPos.z), 50, null, Laya.Handler.create(this, this.CameraTween1))
        }
        CameraTween1() {
            u.ClearTween(this.owner),
                u.MoveTo(this.owner, new Laya.Vector3(this.InitPos.x - .3, this.InitPos.y, this.InitPos.z), 50, null, Laya.Handler.create(this, this.CameraTween))
        }
    }
    class k extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.IsPlayerPebble = !1,
                this.PebbleMaxHP = 300,
                this.PebbleHP = 300,
                this.IsOver = !1,
                this.ShowIndex = 0,
                this.ClearAtkObjIndex = 0,
                this.PlaySoundIndex = 300,
                this.IsPlaySound = !1
        }
        onAwake() {
            this.owner.getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5,
                this.InitMatColor = this.owner.getChildAt(0).meshRenderer.material.albedoColor
        }
        SetPebbleTP(e) {
            if (v._Instance)
                if (e) {
                    this.IsPlayerPebble = !0,
                        this.PebbleTP = v._Instance.PlayerPebbleTP,
                        this.PebbleDTTP = v._Instance.PlayerPebbleDTTP,
                        this.PebbleHPTP = v._Instance.PlayerPebbleHPTP,
                        this.PebbleZYTP = v._Instance.PlayerPebbleZYTP;
                    let e = 300 / this.PebbleMaxHP;
                    this.PebbleDTTP.width = this.PebbleHP * e
                } else {
                    this.IsPlayerPebble = !1,
                        this.PebbleTP = v._Instance.EnemyPebbleTP,
                        this.PebbleDTTP = v._Instance.EnemyPebbleDTTP,
                        this.PebbleHPTP = v._Instance.EnemyPebbleHPTP,
                        this.PebbleZYTP = v._Instance.EnemyPebbleZYTP;
                    let e = 300 / this.PebbleMaxHP;
                    this.PebbleDTTP.width = this.PebbleHP * e
                }
        }
        onUpdate() {
            if (this.PebbleTP && this.PebbleDTTP && this.PebbleHPTP && this.PebbleZYTP && null != this.PebbleZYTP.parent) {
                let e = this.owner.transform.position.clone(),
                    t = new Laya.Vector3(0, 0, 0);
                if (N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t), this.PebbleZYTP.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 300), this.PebbleZYTP.x <= 60 || this.PebbleZYTP.y <= 60 || this.PebbleZYTP.x >= Laya.stage.width - 60 || this.PebbleZYTP.y >= Laya.stage.height - 60) {
                    this.PebbleTP.visible = !1,
                        this.PebbleZYTP.visible = !0,
                        this.PebbleZYTP.pos(this.GetPosX(this.PebbleZYTP.x), this.GetPosY(this.PebbleZYTP.y));
                    let e = this.owner.transform.position.clone(),
                        t = N._Instance.Player.transform.position.clone(),
                        a = this.TwoPointRotation3D(e, t);
                    this.PebbleZYTP.rotation = -a
                } else this.IsOver || (this.PebbleTP.visible = !0),
                    this.PebbleZYTP.visible = !1;
                let a = 300 / this.PebbleMaxHP;
                this.PebbleHPTP.width = this.PebbleHP * a,
                    this.PebbleHP <= 0 && !this.IsOver && !N._Instance.IsOver && (
                        N._Instance.isArenaFinished = !0,
                        console.log("N._Instance.isArenaFinished=" + N._Instance.isArenaFinished),
                        (N._Instance.IsOverRevive || N._Instance.IsHint) &&
                        (N._Instance.IsCreateHint = !1, Laya.View.open("Scene/GamePanel.scene")),
                        this.IsOver = !0,
                        N._Instance.IsOver = !0,
                        N._Instance.IsArenaCountDown = !1,
                        N._Instance.ArenaStopGame(),
                        this.IsPlayerPebble ? (N._Instance.IsArenaWinState = 2, u.MoveTo(N._Instance.Camera, new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 15, this.owner.transform.position.z + 15), 2e3, null, Laya.Handler.create(this, () => {
                            let e = N._Instance.Camera.transform.position;
                            N._Instance.Camera.getComponent(g).InitPos = N._Instance.Camera.transform.position,
                                N._Instance.Camera.getComponent(g).CameraTween(),
                                Laya.timer.once(500, this, () => {
                                    if (u.ClearTween(N._Instance.Camera), N._Instance.Camera.transform.position = e, D._Instance._effect_baozhaeffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                                        n.PlaySound("bomb");
                                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_baozhaeffect);
                                        e.transform.position = new Laya.Vector3(this.owner.transform.position.x, 0, this.owner.transform.position.z),
                                            e.addComponent(S)
                                    }
                                    if (D._Instance._effect_pebblebaozhaeffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_pebblebaozhaeffect);
                                        e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 3, this.owner.transform.position.z),
                                            e.particleRenderer.material.color = new Laya.Vector4(15 / 255, 113 / 255, 171 / 255, 125 / 255),
                                            e.addComponent(S)
                                    }
                                    this.owner.removeSelf(),
                                        Laya.timer.once(2e3, this, () => {
                                            N._Instance.ArenaStopGame(),
                                                Laya.View.open("Scene/ArenaSettlePanel.scene")
                                        })
                                })
                        }))) : (
                            N._Instance.IsArenaWinState = 1,
                            u.MoveTo(N._Instance.Camera,
                                new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 15, this.owner.transform.position.z + 15),
                                2e3, null, Laya.Handler.create(this, () => {
                                    let e = N._Instance.Camera.transform.position;
                                    N._Instance.Camera.getComponent(g).InitPos = N._Instance.Camera.transform.position,
                                        N._Instance.Camera.getComponent(g).CameraTween(),
                                        Laya.timer.once(500, this, () => {
                                            if (u.ClearTween(N._Instance.Camera),
                                                N._Instance.Camera.transform.position = e,
                                                D._Instance._effect_baozhaeffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                                                n.PlaySound("bomb");
                                                let e = N._Instance.EffectBox.addChild(D._Instance.effect_baozhaeffect);
                                                e.transform.position = new Laya.Vector3(this.owner.transform.position.x, 0, this.owner.transform.position.z),
                                                    e.addComponent(S)
                                            }
                                            if (D._Instance._effect_pebblebaozhaeffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                                                let e = N._Instance.EffectBox.addChild(D._Instance.effect_pebblebaozhaeffect);
                                                e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 3, this.owner.transform.position.z),
                                                    e.particleRenderer.material.color = new Laya.Vector4(135 / 255, 78 / 255, 131 / 255, 125 / 255),
                                                    e.addComponent(S)
                                            }
                                            this.owner.removeSelf();
                                            for (let e = 0; e < 10; e++) {
                                                let e = N._Instance.PropBox.addChild(m.SelectProp("Gold"));
                                                e.transform.position = new Laya.Vector3(this.owner.transform.position.x + 6 * Math.random() - 3, .6, this.owner.transform.position.z + 6 * Math.random() - 3),
                                                    e.addComponent(w);
                                                let t = N._Instance.PropBox.addChild(m.SelectProp("ZuanShi"));
                                                t.transform.position = new Laya.Vector3(this.owner.transform.position.x + 6 * Math.random() - 3, 0, this.owner.transform.position.z + 6 * Math.random() - 3),
                                                    t.addComponent(w)
                                            }
                                            if (Math.random() > .9) {
                                                N._Instance.IsDropSP = !0;
                                                let e = N._Instance.PropBox.addChild(m.SelectProp("SuiPian"));
                                                e.transform.position = new Laya.Vector3(this.owner.transform.position.x + 6 * Math.random() - 3, 0, this.owner.transform.position.z + 6 * Math.random() - 3),
                                                    e.addComponent(w)
                                            }
                                            Laya.timer.once(1e3, this, () => {
                                                    if (n.PlaySound("victory"),
                                                        v._Instance.OpenWinTP(),
                                                        D._Instance._effect_yanhuaeffect && i.BenchmarkLevel >= 2) {
                                                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_yanhuaeffect);
                                                        e.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.transform.position.y + 5, N._Instance.Player.transform.position.z),
                                                            e.addComponent(S)
                                                    }
                                                }),
                                                Laya.timer.once(3500, this, () => {
                                                    N._Instance.ArenaStopGame(),
                                                        Laya.View.open("Scene/ArenaSettlePanel.scene")
                                                })
                                        })
                                })
                            )
                        ))
            }
            this.ShowIndex > 0 && (this.ShowIndex--, this.ShowIndex <= 0 && (this.ShowIndex = 0, this.owner.getChildAt(0).meshRenderer.material.albedoColor = this.InitMatColor)),
                this.ClearAtkObjIndex > 0 && (this.ClearAtkObjIndex--, this.ClearAtkObjIndex <= 0 && (this.ClearAtkObjIndex = 0, this.IsPlayerPebble ? N._Instance.AtkPlayerPebbleObj = null : N._Instance.AtkEnemyPebbleObj = null)),
                this.IsPlaySound && (this.PlaySoundIndex--, this.PlaySoundIndex <= 0 && (this.PlaySoundIndex = 0, this.IsPlaySound = !1))
        }
        PebbleXTTween(e) {
            this.IsPlayerPebble ? (N._Instance.AtkPlayerPebbleObj = e, this.IsPlaySound || (this.IsPlaySound = !0, this.PlaySoundIndex = 300)) : N._Instance.AtkEnemyPebbleObj = e,
                this.ClearAtkObjIndex = 180,
                Laya.Tween.clearAll(this.PebbleDTTP);
            let t = 300 / this.PebbleMaxHP,
                a = this.PebbleHP * t;
            0 == a ?
                (
                    this.PebbleDTTP.width && (
                        this.PebbleDTTP.width = 0
                        // Laya.timer.once(300, this, () =>{
                        // 	this.PebbleTP.visible = !1
                        // })
                    )
                ) : Laya.Tween.to(this.PebbleDTTP, {
                        width: a
                    },
                    500, null),
                this.ShowIndex <= 0 && (this.owner.getChildAt(0).meshRenderer.material.albedoColor = new Laya.Vector4(1, 0, 0, 1), this.ShowIndex = 5)
        }
        TwoPointRotation3D(e, t) {
            t.x -= e.x,
                t.z -= e.z;
            var a = 0;
            if (0 == t.x && 0 == t.z) return 0;
            if (t.x > 0 && t.z > 0) a = 0;
            else {
                if (t.x > 0 && 0 == t.z) return 90;
                if (t.x > 0 && t.z < 0) a = 180;
                else {
                    if (0 == t.x && t.z < 0) return 180;
                    if (t.x < 0 && t.z < 0) a = -180;
                    else {
                        if (t.x < 0 && 0 == t.z) return -90;
                        t.x < 0 && t.z > 0 && (a = 0)
                    }
                }
            }
            return Math.atan(t.x / t.z) * (360 / (2 * Math.PI)) + a
        }
        GetPosX(e) {
            return e <= 60 ? 60 : e >= Laya.stage.width - 60 ? Laya.stage.width - 60 : e
        }
        GetPosY(e) {
            return e <= 60 ? 60 : e >= Laya.stage.height - 60 ? Laya.stage.height - 60 : e
        }
        IsInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 100 || a.y <= 100 || a.x >= Laya.stage.width - 100 || a.y >= Laya.stage.height - 100)
        }
    }
    class b extends Laya.Script {
        constructor() {
            super(...arguments),
                this.owner = this.owner,
                this.MyTailsType = 0,
                this.PebbleName = "EnemyPebble",
                this.Hitresult = new Laya.HitResult,
                this.weightdata = [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7]
        }
        onAwake() {
            this.Enemy = this.owner.parent.parent.parent.parent.parent,
                this.EnemyCtrl = this.owner.parent.parent.parent.parent.parent.getComponent(T),
                this.EnemyCtrl.IsTeam ? this.PebbleName = "EnemyPebble" : this.PebbleName = "PlayerPebble",
                this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .1, this.owner.transform.position.z),
                this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .1, this.owner.transform.position.z)
        }
        onUpdate() {
            if (0 != this.MyTailsType ? 1 == this.MyTailsType || 2 == this.MyTailsType || 3 == this.MyTailsType || 5 == this.MyTailsType || 6 == this.MyTailsType ? (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .7), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .7)) : 4 == this.MyTailsType ? (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .73), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .73)) : 7 == this.MyTailsType && (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - 1.2), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - 1.2)) : (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .1, this.owner.transform.position.z), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .1, this.owner.transform.position.z)), N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5), this.Hitresult.succeeded && "JiTui" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk || this.Hitresult.succeeded && "BigJiTui" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk || this.Hitresult.succeeded && "MoGu" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk || this.Hitresult.succeeded && "Name_Effect_ZhaDanEffect" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk) {
                let e = this.Hitresult.collider.owner,
                    t = e.getComponent(C);
                if (!t.IsHitFly) {
                    if (t.IsHitFly = !0, D._Instance._effect_dajieffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_dajieffect);
                        e.transform.position = new Laya.Vector3(this.Hitresult.point.x, .25, this.Hitresult.point.z),
                            e.addComponent(S)
                    }
                    let a = this.GetStrikeLv(t);
                    t.PlayPropAni("propjifei" + a, 1);
                    let s = new Laya.Vector2(0, 0),
                        n = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
                    Laya.Vector2.normalize(n, s),
                        t.BeDir = new Laya.Vector3(-s.x / (7 - (a - 1)), 0, -s.y / (7 - (a - 1)))
                }
            }
            if (this.Hitresult.succeeded && "Player" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk && this.IsArenaStrike("Player", this.Hitresult.collider.owner) || this.Hitresult.succeeded && "Enemy" == this.Hitresult.collider.owner.name && this.EnemyCtrl.IsAtk && this.IsArenaStrike("Enemy", this.Hitresult.collider.owner) && this.Hitresult.collider.owner.getComponent(T).MyId != this.EnemyCtrl.MyId) {
                let e,
                    t = this.Hitresult.collider.owner;
                "Enemy" == this.Hitresult.collider.owner.name && (e = t.getComponent(T)),
                    "Player" == this.Hitresult.collider.owner.name && (e = t.getComponent(_)),
                    e.IsBeAtk || e.IsGod || (e.IsBeAtk = !0, e.BeAtkId = this.EnemyCtrl.MyId, e.BeAtkObj = this.Enemy, e.BeAtkObjCtrl = this.EnemyCtrl, this.AtkEnemy(t, e))
            }
            if (this.Hitresult.succeeded && this.Hitresult.collider.owner.name == this.PebbleName && this.EnemyCtrl.IsAtk && !this.EnemyCtrl.IsPebbleStrike) {
                let e = this.Hitresult.collider.owner.getComponent(k);
                if (D._Instance._effect_dajieffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                    let e = N._Instance.EffectBox.addChild(D._Instance.effect_dajieffect);
                    e.transform.position = new Laya.Vector3(this.Hitresult.point.x, this.Hitresult.point.y + 1, this.Hitresult.point.z),
                        e.addComponent(S)
                }
                this.EnemyCtrl.IsBeAtk || this.EnemyCtrl.IsGod || (this.EnemyCtrl.IsBeAtk = !0, this.EnemyCtrl.IsPebbleStrike = !0, this.EnemyCtrl.IsAtkSJ = !0, this.EnemyCtrl.Atk < e.PebbleHP && this.AtkMyEnemy(this.Enemy, this.EnemyCtrl)),
                    e.PebbleHP -= this.EnemyCtrl.Atk,
                    e.PebbleXTTween(this.Enemy)
            }
        }
        AtkEnemy(e, t) {
            if ("Player" == e.name && n.PlayVibrateShort(), D._Instance._effect_dajieffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_dajieffect);
                e.transform.position = new Laya.Vector3(this.Hitresult.point.x, .25, this.Hitresult.point.z),
                    e.addComponent(S)
            }
            let a = N._Instance.EffectBox.addChild(t.TuoWei);
            if (Laya.timer.once(2e3, this, () => {
                    a.removeSelf()
                }), 10 == this.EnemyCtrl.BigLv && 0 == t.BigLv && Math.random() > .5) {
                if (D._Instance._effect_jisuieffect && i.BenchmarkLevel >= 1 && this.IsInCamera()) {
                    let t = N._Instance.EffectBox.addChild(D._Instance.effect_jisuieffect);
                    t.transform.position = new Laya.Vector3(e.transform.position.x, .5, e.transform.position.z);
                    t.addComponent(S)
                }
                return t.IsDie = !0,
                    e.transform.position = new Laya.Vector3(e.transform.position.x + 1e3, t.DropHeight, e.transform.position.z + 1e3),
                    void("Player" == e.name && (N._Instance.IsStartGame = !1, N._Instance.IsCameraMove = !1))
            }
            let s = this.GetStrikeLv(t);
            if (t.PlayMonstersAni("jifei" + s, 1), D._Instance._effect_yaneffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                t.particleSystem.duration = s >= 3 ? .2 * s : 2 == s ? .5 : .4,
                    t.addComponent(S).Target = e.getChildAt(0)
            }
            let o = new Laya.Vector2(0, 0),
                r = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
            Laya.Vector2.normalize(r, o),
                t.BeDir = new Laya.Vector3(-o.x / (7 - (s - 1)), 0, -o.y / (7 - (s - 1)))
        }
        AtkMyEnemy(e, t) {
            let a = N._Instance.EffectBox.addChild(t.TuoWei);
            Laya.timer.once(2e3, this, () => {
                a.removeSelf()
            });
            if (t.PlayMonstersAni("jifei1", 1), D._Instance._effect_yaneffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                t.particleSystem.duration = .4,
                    t.addComponent(S).Target = e.getChildAt(0)
            }
            let s = new Laya.Vector2(0, 0),
                n = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
            Laya.Vector2.normalize(n, s),
                t.BeDir = new Laya.Vector3(s.x / 14, 0, s.y / 14)
        }
        IsArenaStrike(e, t) {
            if (N._Instance.IsLevelModel) return !0;
            let a;
            switch (e) {
                case "Player":
                    a = t.getComponent(_);
                    break;
                case "Enemy":
                    a = t.getComponent(T)
            }
            return this.EnemyCtrl.IsTeam != a.IsTeam
        }
        IsInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 100 || a.y <= 100 || a.x >= Laya.stage.width - 100 || a.y >= Laya.stage.height - 100)
        }
        TwoPointRotation3D(e, t) {
            t.x -= e.x,
                t.z -= e.z;
            var a = 0;
            if (0 == t.x && 0 == t.z) return 0;
            if (t.x > 0 && t.z > 0) a = 0;
            else {
                if (t.x > 0 && 0 == t.z) return 90;
                if (t.x > 0 && t.z < 0) a = 180;
                else {
                    if (0 == t.x && t.z < 0) return 180;
                    if (t.x < 0 && t.z < 0) a = -180;
                    else {
                        if (t.x < 0 && 0 == t.z) return -90;
                        t.x < 0 && t.z > 0 && (a = 0)
                    }
                }
            }
            return Math.atan(t.x / t.z) * (360 / (2 * Math.PI)) + a
        }
        GetStrikeLv(e) {
            var t = 1;
            let a = 0;
            if (this.EnemyCtrl.IsPoison) return t;
            switch (a = Math.floor(this.EnemyCtrl.BigLv) + 1, (a -= this.weightdata[Math.floor(e.BigLv)]) <= 1 && (a = 1), a) {
                case 1:
                case 2:
                    t = 1;
                    break;
                case 3:
                case 4:
                case 5:
                    t = 2;
                    break;
                case 6:
                case 7:
                    t = 3;
                    break;
                case 8:
                case 9:
                    t = 4;
                    break;
                case 10:
                case 11:
                    t = 5
            }
            return t
        }
    }
    class B extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.FloorType = 0,
                this.IsMove = !1,
                this.FlashIndex = 0,
                this.DropHeight = -3.5,
                this.IsDrop = !1,
                this.DropIndex = 0,
                this.DropMaxIndex = 12
        }
        onAwake() {
            if ("Floor5" != this.owner.name) this.Mian1 = this.owner.getChildAt(0),
                this.Mian2 = this.owner.getChildAt(1),
                this.Mian1Ani = this.Mian1.getComponent(Laya.Animator),
                this.Mian2Ani = this.Mian2.getComponent(Laya.Animator),
                this.Mian1Ani.play("idle"),
                this.Mian2Ani.play("idle"),
                "Floor2" == this.owner.name ? (this.Mian3 = this.owner.getChildAt(2), this.owner.getChildAt(2).getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3) : this.owner.getChildAt(1).getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;
            else {
                this.Mian1 = this.owner.getChildAt(0),
                    this.Mian2 = this.owner.getChildAt(1),
                    this.Mian1Ani = this.Mian1.getComponent(Laya.Animator),
                    this.Mian2Ani = this.Mian2.getComponent(Laya.Animator),
                    this.Mian1Ani.play("idle"),
                    this.Mian2Ani.play("idle");
                for (let e = 0; e < this.owner.numChildren; e++) e >= 2 && (this.owner.getChildAt(e).getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3)
            }
            N._Instance.MianType <= 2 ? this.DropHeight = -3.5 : this.DropHeight = -30
        }
        DropOut() {
            this.FlashIndex++,
                this.FlashIndex % 2 == 0 && this.FlashIndex < 10 ? (this.owner.name, this.Mian1.meshRenderer.material.albedoColor = new Laya.Vector4(1, 1, 1, 1), this.Mian2.meshRenderer.material.albedoColor = new Laya.Vector4(1, 1, 1, 1)) : (this.owner.name, this.Mian1.meshRenderer.material.albedoColor = new Laya.Vector4(.917, .141, .141, 1), this.Mian2.meshRenderer.material.albedoColor = new Laya.Vector4(.917, .141, .141, 1)),
                10 == this.FlashIndex && (this.DropIndex = 0, this.IsDrop = !1, "Floor1" == this.owner.name ? (this.Mian2.name = "Drop", this.Mian1Ani.play("diban1"), this.Mian2Ani.play("diban1")) : "Floor2" == this.owner.name ? (this.Mian3.name = "Drop", this.Mian1Ani.play("diban2"), this.Mian2Ani.play("diban2")) : "Floor5" == this.owner.name && (this.Mian1.name = "Drop", this.Mian1Ani.play("diban1"), this.Mian2Ani.play("diban1")), this.IsMove = !0)
        }
        onUpdate() {
            N._Instance.IsStopGame || (this.IsDrop && (this.DropIndex++, this.DropIndex >= this.DropMaxIndex && (this.DropIndex = 0, this.DropOut())), this.IsMove && (this.owner.transform.translate(new Laya.Vector3(0, -.03, 0), !1), this.owner.transform.position.y <= -3.5 && N._Instance.MianType > 2 && this.owner.transform.translate(new Laya.Vector3(0, -1, 0), !1), this.owner.transform.position.y <= this.DropHeight && this.owner.removeSelf()))
        }
    }
    class x extends Laya.Script3D {
        constructor() {
            super()
        }
        JiFei() {
            let e = this.owner.parent;
            e && e.getComponent(C).JiFei()
        }
        RemoveSpeed() {
            let e = this.owner.parent;
            e && e.getComponent(C).RemoveSpeed()
        }
    }
    class T extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.Hitresult = new Laya.HitResult,
                this.Hitresult1 = new Laya.HitResult,
                this.IsDetection = !0,
                this.IsDie = !1,
                this.IsDrop = !1,
                this.IsGod = !1,
                this.IsMove = !1,
                this.IsAtk = !1,
                this.IsBeAtk = !1,
                this.IsPoison = !1,
                this.IsBoss = !1,
                this.IsTeam = !1,
                this.IsAtkPebble = !1,
                this.IsPebbleStrike = !1,
                this.IsAtkSJ = !1,
                this.BeDir = new Laya.Vector3(0, 0, 0),
                this.SkinId = 1,
                this.MyId = 1,
                this.BeAtkId = 99,
                this.MyTailsType = 1,
                this.EatMeatNum = 0,
                this.MyHP = 0,
                this.BigLv = 0,
                this.MoveSpeed = .1,
                this.KillNum = 0,
                this.DropHeight = -3.5,
                this.BossHP = 100,
                this.BossMaxHP = 100,
                this.MyCarryLv = 1,
                this.Atk = 5,
                this.IsOverGame = !1,
                this.BuffType = 0,
                this.DowerTailsLv = 0,
                this.DowerSpeedLv = 0,
                this.DowerBigLv = 0,
                this.TipsIconPos = new Laya.Vector2(1e4, 1e4),
                this.InitPos = new Laya.Vector2(0, 0),
                this.InitRot = 0,
                this.IsMontion = !1,
                this.MotionIndex = 0,
                this.MotionMaxIndex = 0,
                this.IsGJDR = !0,
                this.PropDetectionRange = 10,
                this.EnemyDetectionRange = 3.45,
                this.Carryobbs = [.2, .3, 1, .8],
                this.AtkPlayerobbs = 1,
                this.AtkEnemyobbs = .8,
                this.RandomType = 1,
                this.Montiondata = null,
                this.Speed = 1,
                this.IsAddEnemyLv = !1,
                this.AddEnemyLvIndex = 0,
                this.AddEnemyLvMaxIndex = 0,
                this.EnemyLv = 0
        }
        onAwake() {
            this.owner.getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2,
                this.ChildNode = this.owner.getChildAt(0),
                this.Skin1 = this.ChildNode.getChildAt(0),
                this.Skin2 = this.ChildNode.getChildAt(1),
                this.Player = N._Instance.Player.getChildAt(0),
                this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z),
                this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z),
                this.Start1Pos = this.owner.getChildByName("Start1Pos"),
                this.Over1Pos = this.owner.getChildByName("Over1Pos"),
                11 == this.SkinId || 22 == this.SkinId ? (this.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, 1), this.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, -2.5)) : (this.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, -1), this.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, 2.5)),
                this.Tails = this.owner.getChildAt(0).getChildByName("Tails"),
                this.TuoWei = this.owner.getChildByName("TuoWei"),
                this.MonstersAni = this.owner.getChildAt(0).getComponent(Laya.Animator),
                this.TailsAni = this.owner.getChildAt(0).getChildByName("Tails").getComponent(Laya.Animator),
                this.PlayTailsAni("putong", 1),
                N._Instance.MianType <= 2 ? this.DropHeight = -3.5 : this.DropHeight = -30,
                N._Instance.IsLevelModel && (this.IsMove = !0, this.AlterDir(), this.EnemyMontion(1))
        }
        EnemyMontion(e, t) {
            switch (this.EnemyMontionStop(), this.RandomType = e, e) {
                case 1:
                    this.MotionMaxIndex = 90 * Math.random() + 60;
                    break;
                case 2:
                    this.MotionMaxIndex = 60 * Math.random() + 30;
                    break;
                case 3:
                    this.MotionMaxIndex = 30 * Math.random() + 30
            }
            this.MotionIndex = 0,
                this.Montiondata = t || null,
                this.IsMontion = !0
        }
        EnemyMontionStop() {
            this.RandomType = 1,
                this.Montiondata = null,
                this.MotionIndex = 0,
                this.IsMontion = !1
        }
        SeekEnemy() {
            let e,
                t;
            if ((t = this.IsTeam ? N._Instance.AtkPlayerPebbleObj : N._Instance.AtkEnemyPebbleObj) && null != t && Math.random() > .3) e = t,
                this.EnemyMontion(2, [3, e]);
            else {
                let t = [],
                    a = N._Instance.EnemyBox;
                for (let e = 0; e < a.numChildren; e++) {
                    let i = a.getChildAt(e),
                        s = i.getComponent(T);
                    this.IsTeam != s.IsTeam && t.push(i)
                }
                if (N._Instance.Player) {
                    let e = N._Instance.Player.getComponent(_);
                    this.IsTeam != e.IsTeam && t.push(N._Instance.Player)
                }
                if (t.sort(function(e, t) {
                        return Math.random() > .5 ? -1 : 1
                    }), t.length > 0 && Math.random() > .7 && !this.IsAtkSJ) this.IsAtkPebble = !1,
                    e = o.GetDataRandom({
                        arry: t,
                        range: 1
                    })[0],
                    this.AlterDir(3, e),
                    this.EnemyMontion(2, [3, e]);
                else {
                    this.IsAtkPebble = !0;
                    let t = N._Instance.PropBox;
                    for (let a = 0; a < t.numChildren; a++) {
                        let i = t.getChildAt(a);
                        this.IsTeam ? "EnemyPebble" == i.name && (e = i) : "PlayerPebble" == i.name && (e = i)
                    }
                    e ? (this.AlterDir(3, e), this.EnemyMontion(2, [3, e])) : (this.AlterDir(), this.EnemyMontion(1))
                }
            }
        }
        BuffSet() {
            switch (this.AddEqTails(this.DowerTailsLv + 1), 11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.1 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .1 * (1 + .05 * this.DowerSpeedLv), 0 == this.DowerBigLv ? this.BigLv = 0 : this.BigLv = .5 + .5 * this.DowerBigLv, this.BuffType) {
                case 1:
                    this.AddEqTails(this.DowerTailsLv + 1 + 5),
                        this.BuffType = 0;
                    break;
                case 2:
                    this.BigLv += 5,
                        this.BuffType = 0;
                    break;
                case 3:
                    11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.12 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .12 * (1 + .05 * this.DowerSpeedLv),
                        Laya.timer.once(1e4, this, () => {
                            11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.1 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .1 * (1 + .05 * this.DowerSpeedLv),
                                this.BuffType = 0
                        })
            }
        }
        PlayMonstersAni(e, t) {
            this.MonstersAni.play("idle"),
                this.MonstersAni.play(e),
                this.MonstersAni.speed = t
        }
        PlayTailsAni(e, t) {
            this.TailsAni.play("putong"),
                this.TailsAni.play(e),
                this.TailsAni.speed = t
        }
        AddTails(e = !0) {
            if (e && D._Instance._effect_likeeffect && this.IsInCamera() && 3 == i.BenchmarkLevel) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_likeeffect);
                e.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv),
                    e.addComponent(S).Target = this.owner
            }
            this.IsPoison = !1,
                this.PlayMonstersAni("chirou", 3);
            let t = !1;
            if (this.MyHP < 10 && (this.BigLv >= 5 ? (this.EatMeatNum++, this.EatMeatNum >= 2 && (this.EatMeatNum = 0, t = !0)) : t = !0), t) {
                this.MyHP++,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0) && this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
                let e = y.SelectTails("Tails" + this.MyTailsType);
                e.meshRenderer.material.albedoColor = this.ColorV4,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                    e.addComponent(b);
                let t = y.SelectTails("Weiba" + this.MyTailsType);
                t.meshRenderer.material.albedoColor = this.ColorV4,
                    this.Tails.getChildAt(this.MyHP).getChildAt(0).addChild(t),
                    t.addComponent(b).MyTailsType = this.MyTailsType,
                    t.transform.localPosition = new Laya.Vector3(0, 0, .55),
                    this.Tails.getChildAt(this.MyHP - 1).active = !0,
                    this.Tails.getChildAt(this.MyHP).active = !0
            }
        }
        AddEqTails(e) {
            e >= 10 && (e = 10),
                this.RemoveAllTails(),
                this.PlayMonstersAni("chirou", 3);
            for (let t = 0; t < e; t++) {
                this.MyHP++,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0) && this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
                let e = y.SelectTails("Tails" + this.MyTailsType);
                e.meshRenderer.material.albedoColor = this.ColorV4,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                    e.addComponent(b);
                let t = y.SelectTails("Weiba" + this.MyTailsType);
                t.meshRenderer.material.albedoColor = this.ColorV4,
                    this.Tails.getChildAt(this.MyHP).getChildAt(0).addChild(t),
                    t.addComponent(b).MyTailsType = this.MyTailsType,
                    t.transform.localPosition = new Laya.Vector3(0, 0, .55),
                    this.Tails.getChildAt(this.MyHP - 1).active = !0,
                    this.Tails.getChildAt(this.MyHP).active = !0
            }
        }
        RemoveAllTails() {
            this.EatMeatNum = 0;
            for (let e = 0; e < this.Tails.numChildren; e++) {
                let t = this.Tails.getChildAt(e).getChildAt(0);
                t.numChildren > 0 && t.getChildAt(0).removeSelf(),
                    this.Tails.getChildAt(e).active = !1
            }
            this.MyHP = 0
        }
        RemoveTails() {
            this.Tails.getChildAt(this.MyHP).getChildAt(0).getChildAt(0).removeSelf(),
                this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
            let e = y.SelectTails("Weiba" + this.MyTailsType);
            e.meshRenderer.material.albedoColor = this.ColorV4,
                this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                e.addComponent(b).MyTailsType = this.MyTailsType,
                e.transform.localPosition = new Laya.Vector3(0, 0, .55),
                this.Tails.getChildAt(this.MyHP).active = !1,
                this.MyHP--
        }
        AddBulk(e = !0) {
            if (e && D._Instance._effect_likeeffect && this.IsInCamera() && 3 == i.BenchmarkLevel) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_likeeffect);
                e.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv),
                    e.addComponent(S).Target = this.owner
            }
            this.IsPoison = !1,
                this.PlayMonstersAni("chirou", 3),
                this.BigLv++,
                this.BigLv >= 10 && (this.BigLv = 10)
        }
        RemoveBulk() {
            if (D._Instance._effect_dueffect && this.IsInCamera() && 3 == i.BenchmarkLevel) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_dueffect);
                e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + .5, this.owner.transform.position.z),
                    e.addComponent(S).Target = this.owner
            }
            this.IsPoison = !0,
                this.PlayMonstersAni("chirou", 3)
        }
        AddBaoHuZhao() {
            this.BaoHuZhao = this.owner.addChild(m.SelectProp("BaoHuZhao")),
                this.BaoHuZhao.transform.localPosition = new Laya.Vector3(0, .725, 0),
                this.BaoHuZhao.transform.localScale = new Laya.Vector3(.45, .45, .45),
                this.BaoHuZhao.active = !0,
                this.IsGod = !0
        }
        CloseGod() {
            this.IsGod = !1,
                this.BaoHuZhao.active = !1,
                this.ReadyGod()
        }
        ReadyGod() {
            10 == i.MaxLevel ? Laya.timer.once(7e3, this, () => {
                this.God()
            }) : Laya.timer.once(5e3, this, () => {
                this.God()
            })
        }
        God() {
            this.IsGod = !0,
                this.BaoHuZhao.active = !0
        }
        RegainState() {
            this.IsAtk = !1
        }
        RegainAni() {
            this.PlayTailsAni("putong", 1),
                this.IsMove = !0
        }
        JiFei() {
            if (Laya.timer.clear(this, this.SpeedCtrl), N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3), this.Hitresult.succeeded) {
                this.BeAtkId = 99,
                    this.IsBeAtk = !1;
                let e = this.owner.addChild(m.SelectProp("TuoWei"));
                e.transform.localPosition = new Laya.Vector3(0, .1, 0),
                    e.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                    this.TuoWei = e,
                    this.IsAtkPebble && this.SeekEnemy()
            } else this.IsDie = !0;
            N._Instance.IsLevelModel || this.IsPebbleStrike || (this.IsAtkSJ = !1, this.SeekEnemy()),
                this.IsPebbleStrike = !1
        }
        RemoveSpeed() {
            if (this.Speed = 1, Laya.timer.frameLoop(1, this, this.SpeedCtrl), this.BeAtkObj && null != this.BeAtkObj && this.BeAtkObjCtrl && null != this.BeAtkObjCtrl && (this.MyHP > 1 || this.BigLv > 0) && this.BeAtkObjCtrl.BigLv > this.BigLv && !this.BeAtkObjCtrl.IsPoison)
                if (Math.random() > .5 && this.MyHP > 1 || this.BigLv <= 0) {
                    let e = N._Instance.PropBox.addChild(m.SelectProp("JiTui"));
                    e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.ChildNode.transform.position.y - 1.6, this.owner.transform.position.z),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        N._Instance.CreateYinYing(e),
                        this.RemoveTails()
                } else {
                    let e = N._Instance.PropBox.addChild(m.SelectProp("BigJiTui"));
                    e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.ChildNode.transform.position.y - 1.6, this.owner.transform.position.z),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        N._Instance.CreateYinYing(e),
                        this.BigLv--
                }
            this.BeAtkObj = null,
                this.BeAtkObjCtrl = null
        }
        SpeedCtrl() {
            this.Speed += .005,
                this.BeDir = new Laya.Vector3(this.BeDir.x / this.Speed, this.BeDir.y / this.Speed, this.BeDir.z / this.Speed)
        }
        AlterDir(e, t) {
            let a,
                s = this.owner.transform.rotationEuler.y;
            if (t) {
                let n = !1,
                    o = 200;
                if (150 == t) {
                    if (n = !0, a = 11 == this.SkinId || 22 == this.SkinId ? s - 120 : s - 150, o = 200, !N._Instance.IsLevelModel && Math.random() > .7) {
                        let e = this.owner.transform.position.clone(),
                            t = new Laya.Vector3(0, 0, this.owner.transform.position.z);
                        a = this.TwoPointRotation3D(e, t),
                            o = 1e3,
                            this.IsDetection = !0
                    }
                } else if (2 == e) n = !0,
                    a = 11 == this.SkinId || 22 == this.SkinId ? t - 180 : t,
                    o = this.IsBoss ? 400 : 1e3;
                else {
                    n = !1,
                        this.IsDetection = !0;
                    let e = this.owner.transform.position.clone(),
                        i = t.transform.position.clone();
                    a = this.TwoPointRotation3D(e, i),
                        this.IsArenaEnemy() ? this.IsGJDR && (this.IsMove = !1, this.IsAtk || this.IsBeAtk || (this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3))) : (11 != this.SkinId && 22 != this.SkinId || (a -= 180), u.RotateTo(this.owner, new Laya.Vector3(0, a, 0), 300, null, Laya.Handler.create(this, () => {
                            this.IsMove = !0,
                                Math.random() > .8 && this.SeekEnemy()
                        })))
                }
                n && u.RotateTo(this.owner, new Laya.Vector3(0, a, 0), 500, null, Laya.Handler.create(this, () => {
                    this.IsMove = !0,
                        Laya.timer.once(o, this, () => {
                            this.IsDetection = !0,
                                N._Instance.IsLevelModel ? 1 != i.MaxLevel && 2 != i.MaxLevel || N._Instance.IsPlayerDie || !N._Instance.Isbfzqsw || 1 != this.MyId && 2 != this.MyId && 3 != this.MyId ? this.EnemyMontion(1) : this.EnemyMontion(3) : this.SeekEnemy()
                        })
                }))
            } else if (this.IsDetection) {
                if (1 != i.MaxLevel && 2 != i.MaxLevel || N._Instance.IsPlayerDie || !N._Instance.Isbfzqsw || 1 != this.MyId && 2 != this.MyId && 3 != this.MyId) {
                    let e = Math.random();
                    if (e <= this.Carryobbs[0]) a = 360 * Math.random();
                    else if (e > this.Carryobbs[0] && e <= this.Carryobbs[1]) {
                        let e;
                        if (e = this.IsMeat("JiTui")) {
                            let t = this.owner.transform.position.clone(),
                                i = e.transform.position.clone();
                            a = this.TwoPointRotation3D(t, i)
                        } else if (e = this.IsMeat("BigJiTui")) {
                            let t = this.owner.transform.position.clone(),
                                i = e.transform.position.clone();
                            a = this.TwoPointRotation3D(t, i)
                        } else this.IsEnemy() && 1 != i.MaxLevel && 2 != i.MaxLevel ? this.IsGJDR && (this.IsMove = !1, this.IsAtk || this.IsBeAtk || (this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3))) : a = 360 * Math.random()
                    } else if (e > this.Carryobbs[1])
                        if (this.IsEnemy()) 1 != i.MaxLevel && 2 != i.MaxLevel ? this.IsGJDR && (this.IsMove = !1, this.IsAtk || this.IsBeAtk || (this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3))) : a = 360 * Math.random();
                        else {
                            let e;
                            if (e = this.IsMeat("JiTui")) {
                                let t = this.owner.transform.position.clone(),
                                    i = e.transform.position.clone();
                                a = this.TwoPointRotation3D(t, i)
                            } else if (e = this.IsMeat("BigJiTui")) {
                                let t = this.owner.transform.position.clone(),
                                    i = e.transform.position.clone();
                                a = this.TwoPointRotation3D(t, i)
                            } else a = 360 * Math.random()
                        }
                } else {
                    let e = this.owner.transform.position.clone(),
                        t = this.Player.transform.position.clone();
                    a = this.TwoPointRotation3D(e, t),
                        this.EnemyDetectionRange = 2,
                        this.IsEnemy(!1) && 1 != i.MaxLevel && 2 != i.MaxLevel && this.IsGJDR && (this.IsMove = !1, this.IsAtk || this.IsBeAtk || (this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3)))
                }
                a && (11 != this.SkinId && 22 != this.SkinId || (a -= 180), u.RotateTo(this.owner, new Laya.Vector3(0, a, 0), 500, null, Laya.Handler.create(this, () => {
                    this.IsMove = !0
                })))
            }
        }
        IsMeat(e) {
            let t = N._Instance.PropBox;
            for (let a = 0; a < t.numChildren; a++) {
                let i = t.getChildAt(a);
                if ("Name_Effect_ZhaDanEffect" != i.name) {
                    let t = i.getComponent(C);
                    if (i.name == e && !t.IsHitFly && Laya.Vector3.distance(this.owner.transform.position, i.transform.position) <= this.PropDetectionRange) return i
                }
            }
        }
        IsEnemy(e = !0) {
            let t = N._Instance.Player,
                a = t.getComponent(_);
            if (Laya.Vector3.distance(this.owner.transform.position, t.transform.position) <= this.EnemyDetectionRange && !a.IsBeAtk && Math.random() <= this.AtkPlayerobbs) return !0;
            if (e && i.MaxLevel > 2) {
                let e = N._Instance.EnemyBox;
                for (let t = 0; t < e.numChildren; t++) {
                    let a = e.getChildAt(t),
                        i = a.getComponent(T);
                    if (Laya.Vector3.distance(this.owner.transform.position, a.transform.position) <= this.EnemyDetectionRange && !i.IsBeAtk && this.MyId != i.MyId && Math.random() <= this.AtkEnemyobbs) return !0
                }
            }
            return !1
        }
        IsArenaEnemy() {
            if (N._Instance.Player) {
                let e = N._Instance.Player,
                    t = e.getComponent(_);
                if (Laya.Vector3.distance(this.owner.transform.position, e.transform.position) <= this.EnemyDetectionRange && !t.IsBeAtk && this.IsTeam != t.IsTeam) return !0
            }
            let e = N._Instance.EnemyBox;
            for (let t = 0; t < e.numChildren; t++) {
                let a = e.getChildAt(t),
                    i = a.getComponent(T);
                if (Laya.Vector3.distance(this.owner.transform.position, a.transform.position) <= this.EnemyDetectionRange && !i.IsBeAtk && this.IsTeam != i.IsTeam && this.MyId != i.MyId) return !0
            }
            return !1
        }
        onUpdate() {
            if (!N._Instance.IsStopGame) {
                if (this.IsMontion && (
                        this.MotionIndex++,
                        this.MotionIndex >= this.MotionMaxIndex && (
                            null != this.Montiondata ? (
                                this.AlterDir(this.Montiondata[0], this.Montiondata[1]),
                                this.EnemyMontion(this.RandomType, this.Montiondata)
                            ) : (
                                this.AlterDir(),
                                this.EnemyMontion(this.RandomType)
                            )
                        )),
                    this.IsAddEnemyLv && (
                        this.AddEnemyLvIndex++,
                        this.AddEnemyLvIndex >= this.AddEnemyLvMaxIndex && (
                            this.AddEnemyLvIndex = 0,
                            this.AddEnemyLv()
                        )
                    ), this.IsEnemyInCamera() ? (
                        this.Skin1.active = !0,
                        this.Skin2.active = !0
                    ) : (
                        this.Skin1.active = !1,
                        this.Skin2.active = !1
                    ), this.Atk = 5 + this.BigLv,
                    N._Instance.IsLevelModel) {
                    if (this.IsBoss && v._Instance && (
                            v._Instance.BossHP = this.BossHP,
                            v._Instance.BossMaxHP = this.BossMaxHP,
                            this.BossHP <= 0)) {
                        this.BossHP = 0,
                            this.BaoHuZhao && (this.BaoHuZhao.active = !1),
                            this.IsGod = !1;
                        let e = N._Instance.PropBox.addChild(m.SelectProp("Gold"));
                        e.transform.position = new Laya.Vector3(this.owner.transform.position.x, .6, this.owner.transform.position.z),
                            e.addComponent(w);
                        let t = N._Instance.PropBox.addChild(m.SelectProp("ZuanShi"));
                        t.transform.position = new Laya.Vector3(this.owner.transform.position.x - 3 * Math.random(), 0, this.owner.transform.position.z - 3 * Math.random()),
                            t.addComponent(w);
                        let a = [100];
                        if (Math.random() >= .5 ? a.push(150) : a.push(50), Math.random() >= .9) {
                            a.push(1);
                            let e = N._Instance.PropBox.addChild(m.SelectProp("SuiPian"));
                            e.transform.position = new Laya.Vector3(this.owner.transform.position.x - 3 * Math.random(), 0, this.owner.transform.position.z - 3 * Math.random()),
                                e.addComponent(w)
                        }
                        this.owner.removeSelf(),
                            //console.log("胜利！"),
                            n.PlaySound("victory"),
                            v._Instance.OpenWinTP();
                        for (let e = 0; e < N._Instance.GameRankData.length; e++)
                            if (0 == N._Instance.GameRankData[e].myid) {
                                N._Instance.GameRankData[e].exp += 100;
                                break
                            }
                        if (N._Instance.IsStartGame = !1, Laya.timer.once(3e3, this, () => {
                                Laya.View.open("Scene/GetAwardPanel.scene", !0, ["Boss", a])
                            }), D._Instance._effect_yanhuaeffect && i.BenchmarkLevel >= 2) {
                            let e = N._Instance.EffectBox.addChild(D._Instance.effect_yanhuaeffect);
                            e.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.transform.position.y + 5, N._Instance.Player.transform.position.z),
                                e.addComponent(S)
                        }
                    }
                    this.EnemyDetectionRange = (.7 + .55 * this.MyHP) * this.Carryobbs[3] * (1 + .1 * this.BigLv)
                } else this.Carryobbs[3] = 1,
                    this.EnemyDetectionRange = (.7 + .55 * this.MyHP) * this.Carryobbs[3] * (1 + .1 * this.BigLv);
                let e = this.ChildNode.transform.position.clone(),
                    t = new Laya.Vector3(0, 0, 0);
                if (N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t), this.IsPoison ? (this.PropertyBox.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 60), this.TipsIconPos = new Laya.Vector2(t.x / Laya.stage.clientScaleX + 20, t.y / Laya.stage.clientScaleY - 70)) : (this.PropertyBox.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 120 - 12 * this.BigLv), this.TipsIconPos = new Laya.Vector2(t.x / Laya.stage.clientScaleX + 20, t.y / Laya.stage.clientScaleY - 130 - 12 * this.BigLv)), this.PropertyBox.rotation = 0, this.PropertyBox.getChildAt(2).visible && (this.PropertyBox.getChildAt(2).visible = !1), this.PropertyBox.x <= 60 || this.PropertyBox.y <= 60 || this.PropertyBox.x >= Laya.stage.width - 60 || this.PropertyBox.y >= Laya.stage.height - 60) {
                    this.PropertyBox.pos(this.GetPosX(this.PropertyBox.x), this.GetPosY(this.PropertyBox.y));
                    let e = this.owner.transform.position.clone(),
                        t = N._Instance.Player.transform.position.clone(),
                        a = this.TwoPointRotation3D(e, t);
                    this.PropertyBox.rotation = -a,
                        this.PropertyBox.getChildAt(2).visible || (this.PropertyBox.getChildAt(2).visible = !0)
                }
                if (this.IsOverGame || (this.IsPoison ? (this.owner.transform.scale = new Laya.Vector3(.5, .5, .5), 3 == this.BuffType ? 11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.14 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .14 * (1 + .05 * this.DowerSpeedLv) : 11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.12 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .12 * (1 + .05 * this.DowerSpeedLv)) : (this.owner.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv), 3 == this.BuffType ? 11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = (.004 * this.BigLv - .12) * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = (.12 - .004 * this.BigLv) * (1 + .05 * this.DowerSpeedLv) : 11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = (.004 * this.BigLv - .1) * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = (.1 - .004 * this.BigLv) * (1 + .05 * this.DowerSpeedLv))), this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z), this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z), N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3), N._Instance.owner.physicsSimulation.raycastFromTo(this.Start1Pos.transform.position, this.Over1Pos.transform.position, this.Hitresult1, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5), (1 != i.MaxLevel && 2 != i.MaxLevel || !N._Instance.IsLevelModel) && (this.Hitresult1.succeeded && "Player" == this.Hitresult1.collider.owner.name && !this.IsBeAtk && !this.IsAtk && this.IsArenaStrike("Player", this.Hitresult1.collider.owner) && Laya.Vector3.distance(this.Hitresult1.collider.owner.transform.position, this.owner.transform.position) <= 1 || this.Hitresult1.succeeded && "Enemy" == this.Hitresult1.collider.owner.name && !this.IsBeAtk && !this.IsAtk && this.IsArenaStrike("Enemy", this.Hitresult1.collider.owner) && this.Hitresult1.collider.owner.getComponent(T) && this.Hitresult1.collider.owner.getComponent(T).MyId != this.MyId && Laya.Vector3.distance(this.Hitresult1.collider.owner.transform.position, this.owner.transform.position) <= 1) && (N._Instance.IsLevelModel ? ("Enemy" == this.Hitresult1.collider.owner.name && i.MaxLevel > 3 || "Player" == this.Hitresult1.collider.owner.name || i.IsSW) && this.IsGJDR && (this.IsMove = !1, this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3)) : this.IsGJDR && (this.IsMove = !1, this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3))), !N._Instance.IsLevelModel) {
                    let e = !1;
                    this.IsTeam ? this.Hitresult1.succeeded && "EnemyPebble" == this.Hitresult1.collider.owner.name && !this.IsBeAtk && !this.IsAtk && this.IsAtkPebble && !this.IsOverGame && Laya.Vector3.distance(this.Hitresult1.collider.owner.transform.position, this.owner.transform.position) <= this.EnemyDetectionRange + 2.5 && (e = !0) : this.Hitresult1.succeeded && "PlayerPebble" == this.Hitresult1.collider.owner.name && !this.IsBeAtk && !this.IsAtk && this.IsAtkPebble && !this.IsOverGame && Laya.Vector3.distance(this.Hitresult1.collider.owner.transform.position, this.owner.transform.position) <= this.EnemyDetectionRange + 2.5 && (e = !0),
                        e && this.IsGJDR && (this.IsMove = !1, this.IsAtk = !0, this.PlayMonstersAni("daji", 3), this.PlayTailsAni("shuaiwei", 3))
                }
                if (this.IsDie) {
                    if (this.Hitresult.collider &&
                        "Drop" == this.Hitresult.collider.owner.name &&
                        !this.IsDrop &&
                        (this.IsDie = !0, this.IsDrop = !0),
                        this.IsDrop ? this.owner.transform.translate(new Laya.Vector3(0, -.03, 0), !1) :
                        this.owner.transform.translate(new Laya.Vector3(0, -.3, 0), !1),
                        this.owner.transform.position.y <= -3.5 &&
                        N._Instance.MianType > 2 &&
                        this.owner.transform.translate(new Laya.Vector3(0, -1, 0), !1),
                        this.owner.transform.position.y <= this.DropHeight) {
                        if (this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.DropHeight, this.owner.transform.position.z), N._Instance.MianType <= 2 && D._Instance._effect_luoshuieffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                            let e = N._Instance.EffectBox.addChild(D._Instance.effect_luoshuieffect);
                            e.transform.position = this.owner.transform.position,
                                e.addComponent(S)
                        }
                        Laya.Pool.recover("Property", this.PropertyBox),
                            this.PropertyBox.removeSelf();
                        for (let e = 0; e < N._Instance.GameRankData.length; e++)
                            if (N._Instance.GameRankData[e].myid == this.MyId && N._Instance.GameRankData[e].dienum++, N._Instance.GameRankData[e].myid == this.BeAtkId) {
                                N._Instance.GameRankData[e].killnum++,
                                    N._Instance.GameRankData[e].exp += 20;
                                let t = {},
                                    a = this.GetMyGameRankData();
                                0 == N._Instance.GameRankData[e].myid ? (v._Instance && v._Instance.OpenKillIcon(N._Instance.GameRankData[e].killnum), t.beatkicon = a.head, t.beatkbadge = a.badge, N._Instance.PlayerKillData.push(t)) : (t.atkicon = N._Instance.GameRankData[e].head, t.atkname = N._Instance.GameRankData[e].name, t.beatkicon = a.head, t.beatkname = a.name, N._Instance.EnemyKillData.push(t)),
                                    v && v._Instance && null != v._Instance.parent && v._Instance.GameRankSet(N._Instance.GameRankData)
                            }
                        if (99 == this.BeAtkId) {
                            let e = this.GetMyGameRankData(),
                                t = {};
                            t.dieicon = e.head,
                                t.diebadge = e.badge,
                                N._Instance.DieData.push(t)
                        }
                        for (let e = 0; e < N._Instance.GameRankData.length; e++)
                            if (N._Instance.GameRankData[e].myid == this.MyId) {
                                N._Instance.GameRankData[e].islive = 0,
                                    N._Instance.GameRankData[e].dietime = (new Date).getTime() / 1e3;
                                break
                            }
                        for (let e = 0; e < N._Instance.EffectBox.numChildren; e++) "Name_Effect_Bosseffect" == N._Instance.EffectBox.getChildAt(e).name && D._Instance.recover(D.Name_Effect_Bosseffect, N._Instance.EffectBox.getChildAt(e));
                        if (this.IsBoss && v._Instance && (v._Instance.BossTP.visible = !1), Laya.timer.clearAll(this), this.EnemyMontionStop(), this.owner.removeSelf(), !N._Instance.IsLevelModel) {
                            let e = this.GetMyGameRankData(),
                                t = {};
                            t.skinid = this.SkinId,
                                t.isteam = this.IsTeam,
                                t.posx = this.InitPos.x,
                                t.posz = this.InitPos.y,
                                t.rot = this.InitRot,
                                t.myid = this.MyId,
                                t.badge = e.badge,
                                t.badgelv = e.badgelv,
                                t.name = e.name,
                                t.head = e.head,
                                t.killnum = e.killnum,
                                t.dienum = e.dienum,
                                N._Instance.ArenaEnemyRevive(t)
                        }
                        if (N._Instance.CreateBigMeat(2), 1 == N._Instance.EnemyBox.numChildren) {
                            let e = N._Instance.EnemyBox.getChildAt(0).getComponent(T);
                            e.IsBoss || (1 == e.MyCarryLv ? this.Carryobbs = [.2, .4, 1, .6] : 2 == e.MyCarryLv ? this.Carryobbs = [.2, .3, 1, .7] : 3 == e.MyCarryLv ? this.Carryobbs = [.1, .2, 1, .8] : e.MyCarryLv >= 4 && (this.Carryobbs = [0, .1, 1, .9]))
                        }
                        if (N._Instance.IsLevelModel && N._Instance.EnemyBox.numChildren <= 0 && N._Instance.Player) {
                            //console.log("胜利！"),
                            n.PlaySound("victory"),
                                v._Instance.OpenWinTP();
                            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                                if (0 == N._Instance.GameRankData[e].myid) {
                                    N._Instance.GameRankData[e].exp += 100;
                                    break
                                }
                            if (N._Instance.IsStartGame && Laya.timer.once(3e3, this, () => {
                                    if (6 == i.MaxLevel || i.MaxLevel % 10 == 0) {
                                        let e = [100];
                                        if (Math.random() >= .5 ? e.push(150) : e.push(50), Math.random() >= .9) {
                                            e.push(1);
                                            let t = N._Instance.PropBox.addChild(m.SelectProp("SuiPian"));
                                            t.transform.position = new Laya.Vector3(this.owner.transform.position.x - 3 * Math.random(), 0, this.owner.transform.position.z - 3 * Math.random()),
                                                t.addComponent(w)
                                        }
                                        Laya.View.open("Scene/GetAwardPanel.scene", !0, ["Boss", e])
                                    } else Laya.View.open("Scene/SettlePanel.scene")
                                }), N._Instance.IsStartGame = !1, D._Instance._effect_yanhuaeffect && i.BenchmarkLevel >= 2) {
                                let e = N._Instance.EffectBox.addChild(D._Instance.effect_yanhuaeffect);
                                e.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.transform.position.y + 5, N._Instance.Player.transform.position.z),
                                    e.addComponent(S)
                            }
                        }
                    }
                } else if (this.IsBeAtk) this.owner.transform.translate(this.BeDir, !1);
                else if (this.IsMove) {
                    if (this.owner.transform.translate(new Laya.Vector3(0, 0, this.MoveSpeed), !0), this.Hitresult1.succeeded || this.IsDetection && (this.IsMove = !1, this.IsDetection = !1, this.EnemyMontionStop(), this.AlterDir(1, 150)), this.Hitresult.collider && "pb_Me" == this.Hitresult.collider.owner.name.substring(0, 5) && this.Hitresult.collider.owner.parent.getComponent(B) && 0 != this.Hitresult.collider.owner.parent.getComponent(B).FlashIndex) {
                        if (this.IsDetection) {
                            this.IsMove = !1,
                                this.IsDetection = !1,
                                this.EnemyMontionStop();
                            let e = [];
                            for (let t = 0; t < N._Instance.FloorBox.numChildren; t++) {
                                let a = N._Instance.FloorBox.getChildAt(t),
                                    i = N._Instance.FloorBox.getChildAt(t).getComponent(B);
                                if (i && 0 == i.FlashIndex) {
                                    let t = {};
                                    t.obj = a,
                                        t.dir = Laya.Vector3.distance(this.owner.transform.position, a.transform.position),
                                        e.push(t)
                                }
                            }
                            if (e.sort(function(e, t) {
                                    return e.dir < t.dir ? -1 : e.dir > t.dir ? 1 : 0
                                }), e) {
                                let t = e[0].obj,
                                    a = this.owner.transform.position.clone(),
                                    i = t.transform.position.clone(),
                                    s = this.TwoPointRotation3D(a, i);
                                this.AlterDir(2, s)
                            }
                        }
                    } else if (this.Hitresult1.collider && "pb_Me" == this.Hitresult1.collider.owner.name.substring(0, 5)) {
                        let e = this.Hitresult1.collider.owner.parent.getComponent(B);
                        e && 0 != e.FlashIndex && this.IsDetection && (this.IsMove = !1, this.IsDetection = !1, this.EnemyMontionStop(), this.AlterDir(1, 150))
                    }
                    this.Hitresult.collider && "Drop" == this.Hitresult.collider.owner.name && !this.IsDrop && (this.IsDie = !0, this.IsDrop = !0)
                }
            }
        }
        IsArenaStrike(e, t) {
            if (N._Instance.IsLevelModel) return !0;
            let a;
            switch (e) {
                case "Player":
                    a = t.getComponent(_);
                    break;
                case "Enemy":
                    a = t.getComponent(T)
            }
            return this.IsTeam != a.IsTeam && !a.IsGod && !this.IsOverGame
        }
        GetMyGameRankData() {
            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                if (N._Instance.GameRankData[e].myid == this.MyId) return N._Instance.GameRankData[e]
        }
        CreatePropertyIcon(e, t) {
            this.PropertyBox = Laya.stage.addChild(Laya.Pool.getItemByClass("Property", Laya.Box)),
                this.PropertyBox.width = 169,
                this.PropertyBox.height = 48,
                this.PropertyBox.pivot(85, 24),
                this.PropertyBox.zOrder = 1,
                this.PropertyBox.pos(1e4, 1e4),
                this.PropertyBox.rotation = 0,
                this.PropertyBox.name = "Property",
                this.PropertyBox.visible = !0,
                N._Instance.IsLevelModel || (N._Instance.IsStartGame && N._Instance.IsCameraMove ? this.PropertyBox.visible = !0 : this.PropertyBox.visible = !1);
            let a = this.GetMyBadge();
            if (t && (a = [t.badge, t.badgelv]), this.IsBoss) 11 == this.SkinId || 22 == this.SkinId ? (this.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, 1), this.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, -3)) : (this.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, -1), this.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, 3)),
                6 == i.MaxLevel ? this.Carryobbs = [.3, .5, 1, .6] : (this.Carryobbs = [.2, .3, 1, .8], i.IsAddBossLv && 10 != i.MaxLevel && (this.AddEnemyLvIndex = 0, this.AddEnemyLvMaxIndex = 600, this.IsAddEnemyLv = !0));
            else {
                let e = a[0];
                0 != i.StreakWinNum && i.StreakWinNum >= 3 && (e += i.StreakWinNum - 2) >= 5 && (e = 5),
                    0 != i.StreakFallNum && (e -= i.StreakFallNum) <= 1 && (e = 1),
                    this.MyCarryLv = e,
                    1 == e ? this.Carryobbs = [.3, .7, 1, .6] : 2 == e ? this.Carryobbs = [.2, .4, 1, .7] : 3 == e ? this.Carryobbs = [.2, .3, 1, .8] : 4 == e ? this.Carryobbs = [.1, .2, 1, .9] : e >= 5 && (this.Carryobbs = [0, .1, 1, 1]),
                    3 == i.MaxLevel && (i.IsSW ? this.Carryobbs = [.3, .7, 1, .6] : this.Carryobbs = [0, .1, 1, 1])
            }
            if (this.PropertyBox.numChildren <= 0) {
                let i = this.PropertyBox.addChild(new Laya.Image);
                i.skin = "res/Icon/Badge/Badge_0" + a[0] + ".png",
                    i.width = 150,
                    i.height = 150,
                    i.pos(27, 22),
                    i.pivot(75, 75),
                    i.scale(.4, .4),
                    i.name = "BadegIcon";
                let s = this.PropertyBox.addChild(new Laya.Label);
                s.text = N._Instance.EnemyrandonNameData[this.MyId - 1],
                    t && (s.text = t.name),
                    s.font = "SimHei",
                    s.fontSize = 18,
                    s.color = e,
                    s.align = "center",
                    s.valign = "middle",
                    s.overflow = "hidden",
                    s.width = 112,
                    s.height = 20,
                    s.pos(111, 24),
                    s.pivot(56, 10),
                    s.name = "NameLabel";
                let n = this.PropertyBox.addChild(new Laya.Image);
                n.skin = "res/Icon/JianTou.png",
                    n.width = 74,
                    n.height = 98,
                    n.pos(84.5, -25),
                    n.pivot(37, 49),
                    n.scale(.4, .4),
                    n.name = "Jiantou",
                    n.visible = !1
            } else this.PropertyBox.getChildByName("BadegIcon").skin = "res/Icon/Badge/Badge_0" + a[0] + ".png",
                this.PropertyBox.getChildByName("NameLabel").text = N._Instance.EnemyrandonNameData[this.MyId - 1],
                t && (this.PropertyBox.getChildByName("NameLabel").text = t.name),
                this.PropertyBox.getChildByName("NameLabel").color = e,
                this.PropertyBox.getChildByName("Jiantou").visible = !1;
            let s = {};
            s.myid = this.MyId,
                s.badge = a[0],
                s.badgelv = a[1],
                s.exp = 20,
                s.name = N._Instance.EnemyrandonNameData[this.MyId - 1],
                s.killnum = this.KillNum,
                s.dienum = 0,
                s.isself = 0,
                s.islive = 1,
                s.head = "res/Icon/Head/" + N._Instance.EnemyrandomHeadData[this.MyId - 1] + ".jpg",
                s.dietime = 0,
                s.isteam = this.IsTeam,
                t && (s.name = t.name, s.killnum = t.killnum, s.dienum = t.dienum, s.head = t.head, s.isteam = t.isteam);
            let n = !0;
            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                if (N._Instance.GameRankData[e].myid == s.myid) {
                    n = !1,
                        N._Instance.GameRankData[e] = s;
                    break
                }
            if (n && N._Instance.GameRankData.push(s), N._Instance.IsLevelModel) {
                let e = 10;
                if (e = 1 == i.MaxLevel ? 2 : 2 == i.MaxLevel || 3 == i.MaxLevel ? 4 : 5 == i.MaxLevel || 7 == i.MaxLevel ? 6 : 8 == i.MaxLevel ? 8 : 10, N._Instance.GameRankData.length == e)
                    for (var o = 0; o < N._Instance.GameRankData.length - 1; o++)
                        for (var r = 0; r < N._Instance.GameRankData.length - 1 - o; r++)
                            if (N._Instance.GameRankData[r].isself > N._Instance.GameRankData[r + 1].isself) {
                                var l = N._Instance.GameRankData[r];
                                N._Instance.GameRankData[r] = N._Instance.GameRankData[r + 1],
                                    N._Instance.GameRankData[r + 1] = l
                            }
            }
            N._Instance.IsLevelModel ? 3 == i.MaxLevel ? (i.IsSW ? this.IsGJDR = !1 : this.IsGJDR = !0, this.Carryobbs = [.3, .7, 1, .6]) : 5 == i.MaxLevel ? this.MyId <= 2 ? this.IsGJDR = !0 : this.IsGJDR = !1 : 8 == i.MaxLevel ? this.MyId <= 3 ? this.IsGJDR = !0 : this.IsGJDR = !1 : 9 == i.MaxLevel ? this.MyId <= 4 ? this.IsGJDR = !0 : this.IsGJDR = !1 : this.IsGJDR = !0 : this.IsGJDR = !0
        }
        AddEnemyLv() {
            this.EnemyLv++,
                1 == this.EnemyLv ? this.Carryobbs = [.1, .2, 1, .9] : 2 == this.EnemyLv && (this.Carryobbs = [0, .1, 1, 1], this.IsAddEnemyLv = !1, this.AddEnemyLvIndex = 0)
        }
        GetMyBadge() {
            let e = 0;
            e = i.Badge <= 2 ? 4 * (i.Badge - 1) + i.BadgeLv : 5 * (i.Badge - 1) + i.BadgeLv - 2;
            let t = o.GetDataRandom({
                arry: [e - 3, e - 2, e - 1, e, e + 1, e + 2, e + 3],
                range: 1
            })[0];
            return t <= 1 && (t = 1),
                t >= 33 && (t = 33),
                t <= 4 ? [1, t] : t > 4 && t <= 8 ? [2, t - 4] : t > 8 && t <= 13 ? [3, t - 8] : t > 13 && t <= 18 ? [4, t - 13] : t > 18 && t <= 23 ? [5, t - 18] : t > 23 && t <= 28 ? [6, t - 23] : t > 28 && t <= 33 ? [7, t - 28] : void 0
        }
        IsInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 100 || a.y <= 100 || a.x >= Laya.stage.width - 100 || a.y >= Laya.stage.height - 100)
        }
        IsEnemyInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= -100 || a.y <= -100 || a.x >= Laya.stage.width + 100 || a.y >= Laya.stage.height + 100)
        }
        TwoPointRotation3D(e, t) {
            t.x -= e.x,
                t.z -= e.z;
            var a = 0;
            if (0 == t.x && 0 == t.z) return 0;
            if (t.x > 0 && t.z > 0) a = 0;
            else {
                if (t.x > 0 && 0 == t.z) return 90;
                if (t.x > 0 && t.z < 0) a = 180;
                else {
                    if (0 == t.x && t.z < 0) return 180;
                    if (t.x < 0 && t.z < 0) a = -180;
                    else {
                        if (t.x < 0 && 0 == t.z) return -90;
                        t.x < 0 && t.z > 0 && (a = 0)
                    }
                }
            }
            return Math.atan(t.x / t.z) * (360 / (2 * Math.PI)) + a
        }
        GetPosX(e) {
            return e <= 60 ? 60 : e >= Laya.stage.width - 60 ? Laya.stage.width - 60 : e
        }
        GetPosY(e) {
            return e <= 60 ? 60 : e >= Laya.stage.height - 60 ? Laya.stage.height - 60 : e
        }
    }
    class C extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.Hitresult = new Laya.HitResult,
                this.IsMove = !0,
                this.IsHitFly = !1,
                this.IsDie = !1,
                this.IsDrop = !1,
                this.IsGod = !1,
                this.BeDir = new Laya.Vector3(0, 0, 0),
                this.DropHeight = -3.5,
                this.BigLv = 0,
                this.RemoveIndex = 0,
                this.Speed = 1,
                this.IsRun = !1,
                this.IsZhaDanRun = !1,
                this.CountDownNum = 8,
                this.IsRemove = !1
        }
        onAwake() {
            "Gold" != this.owner.name && (this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z), this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z)),
                "Name_Effect_ZhaDanEffect" == this.owner.name && (this.ZhaDan = this.owner.getChildAt(0).getChildAt(0), this.ZhaDan.transform.localPosition = new Laya.Vector3(0, 3, 0), this.owner.getChildAt(0).getChildAt(0).getChildAt(1) && this.owner.getChildAt(0).getChildAt(0).getChildAt(1).destroy()),
                this.Target = N._Instance.Player,
                this.TargetCtrl = this.Target.getComponent(_),
                this.GetToTarget(),
                "Name_Effect_ZhaDanEffect" == this.owner.name && (this.MyAni = this.owner.getComponent(Laya.Animator), this.PlayZhaDan()),
                "Gold" != this.owner.name && (this.PropAni = this.owner.getChildAt(0).getComponent(Laya.Animator), this.PlayPropAni("idle", 1), N._Instance.MianType <= 2 ? this.DropHeight = -3.5 : this.DropHeight = -30),
                "Name_Effect_ZhaDanEffect" != this.owner.name && "JiTui" != this.owner.name && "BigJiTui" != this.owner.name && "MoGu" != this.owner.name || (this.owner.getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4)
        }
        GetToTarget() {
            if ("Gold" != this.owner.name) {
                let e = N._Instance.EnemyBox;
                e.getChildAt(0) && (this.Enemy1 = e.getChildAt(0), this.Enemy1Ctrl = e.getChildAt(0).getComponent(T)),
                    e.getChildAt(1) && (this.Enemy2 = e.getChildAt(1), this.Enemy2Ctrl = e.getChildAt(1).getComponent(T)),
                    e.getChildAt(2) && (this.Enemy3 = e.getChildAt(2), this.Enemy3Ctrl = e.getChildAt(2).getComponent(T)),
                    e.getChildAt(3) && (this.Enemy4 = e.getChildAt(3), this.Enemy4Ctrl = e.getChildAt(3).getComponent(T)),
                    e.getChildAt(4) && (this.Enemy5 = e.getChildAt(4), this.Enemy5Ctrl = e.getChildAt(4).getComponent(T)),
                    e.getChildAt(5) && (this.Enemy6 = e.getChildAt(5), this.Enemy6Ctrl = e.getChildAt(5).getComponent(T)),
                    e.getChildAt(6) && (this.Enemy7 = e.getChildAt(6), this.Enemy7Ctrl = e.getChildAt(6).getComponent(T)),
                    e.getChildAt(7) && (this.Enemy8 = e.getChildAt(7), this.Enemy8Ctrl = e.getChildAt(7).getComponent(T)),
                    e.getChildAt(8) && (this.Enemy9 = e.getChildAt(8), this.Enemy9Ctrl = e.getChildAt(8).getComponent(T))
            }
        }
        PlayZhaDan() {
            this.MyAni.play("zdidle"),
                4 == i.MaxLevel ? (this.CountDownNum = 20, this.MyAni.play("countdown1"), Laya.timer.once(2e4, this, this.CountDown)) : (this.CountDownNum = 8, this.MyAni.play("countdown"), Laya.timer.once(8e3, this, this.CountDown)),
                Laya.timer.loop(1e3, this, this.CountDown1),
                this.CreateCountDownLabel()
        }
        PlayPropAni(e, t) {
            this.PropAni.play("idle"),
                this.PropAni.play(e),
                this.PropAni.speed = t
        }
        JiFei() {
            this.IsHitFly = !1,
                Laya.timer.clear(this, this.SpeedCtrl)
        }
        RemoveSpeed() {
            this.Speed = 1,
                Laya.timer.frameLoop(1, this, this.SpeedCtrl)
        }
        SpeedCtrl() {
            this.Speed += .005,
                this.BeDir = new Laya.Vector3(this.BeDir.x / this.Speed, this.BeDir.y / this.Speed, this.BeDir.z / this.Speed)
        }
        onUpdate() {
            if (!N._Instance.IsStopGame) {
                if ("Gold" == this.owner.name && this.owner.transform.rotate(new Laya.Vector3(0, .05, 0), !1), !this.owner || "JiTui" != this.owner.name && "BigJiTui" != this.owner.name && "MoGu" != this.owner.name || (this.IsPropInCamera() ? this.IsRun || (this.IsRun = !0, this.owner.getChildAt(0).active = !0, this.IsHitFly || this.PlayPropAni("idle", 1)) : (this.IsRun = !1, this.owner && (this.owner.getChildAt(0).active = !1))), this.owner && "Name_Effect_ZhaDanEffect" == this.owner.name && (this.IsPropInCamera() ? this.IsRun || (this.IsRun = !0, this.owner.getChildAt(0).getChildAt(0).active = !0) : (this.IsRun = !1, this.owner && (this.owner.getChildAt(0).getChildAt(0).active = !1))), this.owner && "Name_Effect_ZhaDanEffect" == this.owner.name) {
                    let e = this.ZhaDan.transform.position.clone(),
                        t = new Laya.Vector3(0, 0, 0);
                    N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t),
                        this.CountDownLabel.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 100),
                        this.CountDownLabel.value = this.CountDownNum.toString()
                }
                this.IsMove && "Gold" != this.owner.name && ("Name_Effect_ZhaDanEffect" != this.owner.name ? (this.owner.transform.translate(new Laya.Vector3(0, -.05, 0), !1), this.owner.transform.position.y <= 0 && (this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, 0, this.owner.transform.position.z), this.IsMove = !1)) : (this.ZhaDan.transform.translate(new Laya.Vector3(0, -.05, 0), !0), this.ZhaDan.transform.localPosition.y <= 0 && (this.ZhaDan.transform.localPosition = new Laya.Vector3(0, 0, 0), this.IsMove = !1)));
                let e = this.owner.transform.position;
                if ("JiTui" == this.owner.name) Math.abs(e.x - this.Target.transform.position.x) <= 1.1 + .08 * this.TargetCtrl.BigLv && Math.abs(e.y - this.Target.transform.position.y) <= 1.5 + .16 * this.TargetCtrl.BigLv && Math.abs(e.z - this.Target.transform.position.z) <= .8 + .04 * this.TargetCtrl.BigLv && !this.TargetCtrl.IsBeAtk && (n.PlaySound("Devour"), this.owner.removeSelf(), this.Target.getComponent(_).AddTails());
                else if ("BigJiTui" == this.owner.name) Math.abs(e.x - this.Target.transform.position.x) <= 1.5 + .08 * this.TargetCtrl.BigLv && Math.abs(e.y - this.Target.transform.position.y) <= 1.5 + .16 * this.TargetCtrl.BigLv && Math.abs(e.z - this.Target.transform.position.z) <= 1.1 + .04 * this.TargetCtrl.BigLv && !this.TargetCtrl.IsBeAtk && (n.PlaySound("Devour"), this.owner.removeSelf(), this.Target.getComponent(_).AddBulk());
                else if ("MoGu" == this.owner.name) Math.abs(e.x - this.Target.transform.position.x) <= 1.2 + .08 * this.TargetCtrl.BigLv && Math.abs(e.y - this.Target.transform.position.y) <= 1.5 + .16 * this.TargetCtrl.BigLv && Math.abs(e.z - this.Target.transform.position.z) <= .8 + .04 * this.TargetCtrl.BigLv && !this.TargetCtrl.IsBeAtk && (n.PlaySound("Devour"), this.owner.removeSelf(), this.Target.getComponent(_).RemoveBulk());
                else if ("Gold" == this.owner.name && Math.abs(e.x - this.Target.transform.position.x) <= 1.2 && Math.abs(e.y - this.Target.transform.position.y) <= 2.1 && Math.abs(e.z - this.Target.transform.position.z) <= .7) {
                    this.Target.getComponent(_).EatGold(this.owner),
                        this.owner.removeSelf();
                    let e = !0;
                    for (let t = 0; t < N._Instance.PropBox.numChildren; t++)
                        if ("Gold" == N._Instance.PropBox.getChildAt(t).name) {
                            e = !1;
                            break
                        }
                    if (e) {
                        if (
                            //console.log("胜利！"), 
                            n.PlaySound("victory"), N._Instance.IsStartGame && Laya.timer.once(2500, this, () => {
                                Laya.View.open("Scene/GetAwardPanel.scene", !0, ["SettleGold"])
                            }), N._Instance.IsStartGame = !1, D._Instance._effect_yanhuaeffect && i.BenchmarkLevel >= 2) {
                            let e = N._Instance.EffectBox.addChild(D._Instance.effect_yanhuaeffect);
                            e.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.transform.position.y + 5, N._Instance.Player.transform.position.z),
                                e.addComponent(S)
                        }
                        for (let e = 0; e < N._Instance.PropBox.numChildren; e++)
                            if ("Name_Effect_ZhaDanEffect" == N._Instance.PropBox.getChildAt(e).name) {
                                let t = N._Instance.PropBox.getChildAt(e).getComponent(C);
                                Laya.Pool.recover("CountDownLabel", t.CountDownLabel),
                                    t.CountDownLabel.removeSelf(),
                                    Laya.timer.clearAll(N._Instance.PropBox.getChildAt(e).getComponent(C)),
                                    D._Instance.recover(D.Name_Effect_ZhaDanEffect, N._Instance.PropBox.getChildAt(e))
                            } else this.owner.removeSelf()
                    }
                }
                if (this.Enemy1 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy1.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy1.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy1.transform.position.z) <= .8 && !this.Enemy1Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy1.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy1.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy1.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy1.transform.position.z) <= 1.1 && !this.Enemy1Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy1.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy1.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy1.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy1.transform.position.z) <= .8 && !this.Enemy1Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy1.getComponent(T).RemoveBulk())), this.Enemy2 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy2.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy2.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy2.transform.position.z) <= .8 && !this.Enemy2Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy2.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy2.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy2.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy2.transform.position.z) <= 1.1 && !this.Enemy2Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy2.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy2.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy2.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy2.transform.position.z) <= .8 && !this.Enemy2Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy2.getComponent(T).RemoveBulk())), this.Enemy3 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy3.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy3.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy3.transform.position.z) <= .8 && !this.Enemy3Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy3.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy3.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy3.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy3.transform.position.z) <= 1.1 && !this.Enemy3Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy3.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy3.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy3.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy3.transform.position.z) <= .8 && !this.Enemy3Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy3.getComponent(T).RemoveBulk())), this.Enemy4 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy4.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy4.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy4.transform.position.z) <= .8 && !this.Enemy4Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy4.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy4.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy4.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy4.transform.position.z) <= 1.1 && !this.Enemy4Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy4.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy4.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy4.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy4.transform.position.z) <= .8 && !this.Enemy4Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy4.getComponent(T).RemoveBulk())), this.Enemy5 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy5.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy5.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy5.transform.position.z) <= .8 && !this.Enemy5Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy5.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy5.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy5.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy5.transform.position.z) <= 1.1 && !this.Enemy5Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy5.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy5.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy5.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy5.transform.position.z) <= .8 && !this.Enemy5Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy5.getComponent(T).RemoveBulk())), this.Enemy6 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy6.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy6.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy6.transform.position.z) <= .8 && !this.Enemy6Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy6.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy6.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy6.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy6.transform.position.z) <= 1.1 && !this.Enemy6Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy6.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy6.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy6.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy6.transform.position.z) <= .8 && !this.Enemy6Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy6.getComponent(T).RemoveBulk())), this.Enemy7 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy7.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy7.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy7.transform.position.z) <= .8 && !this.Enemy7Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy7.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy7.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy7.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy7.transform.position.z) <= 1.1 && !this.Enemy7Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy7.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy7.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy7.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy7.transform.position.z) <= .8 && !this.Enemy7Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy7.getComponent(T).RemoveBulk())), this.Enemy8 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy8.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy8.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy8.transform.position.z) <= .8 && !this.Enemy8Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy8.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy8.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy8.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy8.transform.position.z) <= 1.1 && !this.Enemy8Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy8.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy8.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy8.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy8.transform.position.z) <= .8 && !this.Enemy8Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy8.getComponent(T).RemoveBulk())), this.Enemy9 && ("JiTui" == this.owner.name ? Math.abs(e.x - this.Enemy9.transform.position.x) <= 1.1 && Math.abs(e.y - this.Enemy9.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy9.transform.position.z) <= .8 && !this.Enemy9Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy9.getComponent(T).AddTails()) : "BigJiTui" == this.owner.name ? Math.abs(e.x - this.Enemy9.transform.position.x) <= 1.5 && Math.abs(e.y - this.Enemy9.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy9.transform.position.z) <= 1.1 && !this.Enemy9Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy9.getComponent(T).AddBulk()) : "MoGu" == this.owner.name && Math.abs(e.x - this.Enemy9.transform.position.x) <= 1.2 && Math.abs(e.y - this.Enemy9.transform.position.y) <= 1.5 && Math.abs(e.z - this.Enemy9.transform.position.z) <= .8 && !this.Enemy9Ctrl.IsBeAtk && (this.owner.removeSelf(), this.Enemy9.getComponent(T).RemoveBulk())), "Gold" != this.owner.name && (this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z), this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z)), "Gold" != this.owner.name)
                    if (N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3), this.IsHitFly || this.IsMove ? this.IsDie = !1 : this.Hitresult.succeeded && "pb_Me" == this.Hitresult.collider.owner.name.substring(0, 5) ? this.IsDie = !1 : this.IsDie = !0, this.IsDie) {
                        if (this.Hitresult.succeeded && "Drop" == this.Hitresult.collider.owner.name && !this.IsDrop && (this.IsDie = !0, this.IsDrop = !0), this.IsDrop ? this.owner.transform.translate(new Laya.Vector3(0, -.03, 0), !1) : this.owner.transform.translate(new Laya.Vector3(0, -.3, 0), !1), this.owner.transform.position.y <= -3.5 && N._Instance.MianType > 2 && this.owner.transform.translate(new Laya.Vector3(0, -1, 0), !1), this.owner.transform.position.y <= this.DropHeight) {
                            if (this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.DropHeight, this.owner.transform.position.z), N._Instance.MianType <= 2 && D._Instance._effect_luoshuieffect && this.IsInCamera() && 3 == i.BenchmarkLevel) {
                                let e = N._Instance.EffectBox.addChild(D._Instance.effect_luoshuieffect);
                                e.transform.position = this.owner.transform.position,
                                    e.addComponent(S)
                            }
                            "Name_Effect_ZhaDanEffect" != this.owner.name ? this.owner.removeSelf() : (Laya.Pool.recover("CountDownLabel", this.CountDownLabel), this.CountDownLabel.removeSelf(), Laya.timer.clearAll(this), D._Instance.recover(D.Name_Effect_ZhaDanEffect, this.owner))
                        }
                    } else this.IsHitFly && this.owner.transform.translate(this.BeDir, !1);
                !this.owner || "JiTui" != this.owner.name && "BigJiTui" != this.owner.name && "MoGu" != this.owner.name || (this.RemoveIndex++, this.RemoveIndex >= 600 && this.IsInCameraRemoveSelf())
            }
        }
        CountDown() {
            Laya.timer.clear(this, this.CountDown);
            let e = 6.55;
            e = this.IsGod ? 9.5 : 6.55;
            let t = this.owner.transform.position.clone(),
                a = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(t, N._Instance.Camera.projectionViewMatrix, a);
            let s = new Laya.Vector2(a.x / Laya.stage.clientScaleX, a.y / Laya.stage.clientScaleY);
            s.x >= -500 && s.y >= -500 && s.x <= Laya.stage.width + 500 && s.y <= Laya.stage.height + 500 && n.PlaySound("bomb");
            let o = this.Target.getComponent(_);
            if (Laya.Vector3.distance(this.owner.transform.position, this.Target.transform.position) <= e && !o.IsBeAtk && !o.IsGod) {
                o.IsBeAtk = !0,
                    o.BeAtkId = 100,
                    o.BigLv = 0;
                let e = Math.floor(o.MyHP / 2);
                o.MyHP = 0,
                    e < 1 ? o.AddEqTails(1) : o.AddEqTails(e),
                    n.PlayVibrateShort();
                let t = N._Instance.EffectBox.addChild(o.TuoWei);
                if (Laya.timer.once(2e3, this, () => {
                        t.removeSelf()
                    }), o.PlayMonstersAni("jifei5", 1), D._Instance._effect_yaneffect && i.BenchmarkLevel >= 1) {
                    let e = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                    e.particleSystem.duration = 1,
                        e.addComponent(S).Target = this.Target.getChildAt(0)
                }
                let a = new Laya.Vector2(0, 0),
                    s = new Laya.Vector2(this.owner.transform.position.x - this.Target.transform.position.x, this.owner.transform.position.z - this.Target.transform.position.z);
                this.owner.transform.position.x - this.Target.transform.position.x == 0 && this.owner.transform.position.z - this.Target.transform.position.z == 0 && (s = new Laya.Vector2(0, .1)),
                    Laya.Vector2.normalize(s, a),
                    o.BeDir = new Laya.Vector3(-a.x / 3, 0, -a.y / 3)
            }
            let r = N._Instance.EnemyBox;
            for (let t = 0; t < r.numChildren; t++) {
                let a = r.getChildAt(t),
                    s = a.getComponent(T);
                if (Laya.Vector3.distance(this.owner.transform.position, a.transform.position) <= e && !s.IsBeAtk && !s.IsGod) {
                    s.IsBeAtk = !0,
                        s.BeAtkId = 100,
                        s.BigLv = 0;
                    let e = Math.floor(s.MyHP / 2);
                    s.MyHP = 0,
                        e < 1 ? s.AddEqTails(1) : s.AddEqTails(e);
                    let t = N._Instance.EffectBox.addChild(s.TuoWei);
                    if (Laya.timer.once(2e3, this, () => {
                            t.removeSelf()
                        }), s.PlayMonstersAni("jifei5", 1), D._Instance._effect_yaneffect && this.IsInCamera() && i.BenchmarkLevel >= 1) {
                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                        e.particleSystem.duration = 1,
                            e.addComponent(S).Target = a.getChildAt(0)
                    }
                    let n = new Laya.Vector2(0, 0),
                        o = new Laya.Vector2(this.owner.transform.position.x - a.transform.position.x, this.owner.transform.position.z - a.transform.position.z);
                    Laya.Vector2.normalize(o, n),
                        s.BeDir = new Laya.Vector3(-n.x / 3, 0, -n.y / 3)
                }
            }
            let l = N._Instance.PropBox;
            for (let t = 0; t < l.numChildren; t++) {
                let a = l.getChildAt(t);
                if ("Name_Effect_ZhaDanEffect" != a.name) {
                    let i = l.getChildAt(t).getComponent(C);
                    Laya.Vector3.distance(this.owner.transform.position, a.transform.position) <= e - .2 && i && !i.IsHitFly && (a.removeSelf(), t--)
                }
            }
            if (D._Instance._effect_baozhaeffect && this.IsInCamera1() && i.BenchmarkLevel >= 1) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_baozhaeffect);
                e.transform.position = this.owner.transform.position,
                    e.addComponent(S)
            }
            Laya.Pool.recover("CountDownLabel", this.CountDownLabel),
                this.CountDownLabel.removeSelf(),
                D._Instance.recover(D.Name_Effect_ZhaDanEffect, this.owner)
        }
        CountDown1() {
            this.CountDownNum--,
                this.CountDownNum <= 0 && Laya.timer.clear(this, this.CountDown1)
        }
        IsInCameraRemoveSelf() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            a.x <= -100 || a.y <= -100 || a.x >= Laya.stage.width + 100 || a.y >= Laya.stage.height + 100 ? (this.IsRemove = !0, this.owner.removeSelf()) : this.RemoveIndex = 0
        }
        IsInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 100 || a.y <= 100 || a.x >= Laya.stage.width - 100 || a.y >= Laya.stage.height - 100)
        }
        IsInCamera1() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 0 || a.y <= 0 || a.x >= Laya.stage.width || a.y >= Laya.stage.height)
        }
        IsPropInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 0 || a.y <= 0 || a.x >= Laya.stage.width || a.y >= Laya.stage.height)
        }
        CreateCountDownLabel() {
            this.CountDownLabel = Laya.stage.addChild(Laya.Pool.getItemByClass("CountDownLabel", Laya.FontClip)),
                this.CountDownLabel.width = 76,
                this.CountDownLabel.height = 47,
                this.CountDownLabel.pivot(37, 26),
                this.CountDownLabel.zOrder = 1,
                this.CountDownLabel.pos(1e4, 1e4),
                this.CountDownLabel.skin = "res/Icon/CountDown.png",
                this.CountDownLabel.align = "center",
                this.CountDownLabel.sheet = "0123456789",
                this.CountDownLabel.value = this.CountDownNum.toString(),
                this.CountDownLabel.visible = !0,
                this.CountDownLabel.name = "CountDownLabel"
        }
    }
    class D {
        static get _Instance() {
            if (!D._instance) {
                let e = new D;
                D._instance = e
            }
            return D._instance
        }
        initdowerlv() {
            this._effect_dowerlveffect = f.SelectEffect("DowerLv")
        }
        init() {
            1 == i.BenchmarkLevel ? (this._effect_likeeffect = f.SelectEffect("Like"), this._effect_luoshuieffect = f.SelectEffect("LuoShui"), this._effect_yaneffect = f.SelectEffect("Yan"), this._effect_dueffect = f.SelectEffect("Du"), this._effect_baozhaeffect = f.SelectEffect("BaoZha"), this._effect_bosseffect = f.SelectEffect("Boss"), this._effect_zhadaneffect = f.SelectEffect("ZhaDan"), this._effect_dowerlveffect = f.SelectEffect("DowerLv"), this._effect_pebblebaozhaeffect = f.SelectEffect("PebbleBaoZha"), this._effect_jisuieffect = f.SelectEffect("JiSui")) : (this._effect_likeeffect = f.SelectEffect("Like"), this._effect_luoshuieffect = f.SelectEffect("LuoShui"), this._effect_yaneffect = f.SelectEffect("Yan"), this._effect_zhadaneffect = f.SelectEffect("ZhaDan"), this._effect_baozhaeffect = f.SelectEffect("BaoZha"), this._effect_dueffect = f.SelectEffect("Du"), this._effect_dajieffect = f.SelectEffect("DaJi"), this._effect_xueeffect = f.SelectEffect("Xue"), this._effect_yanhuaeffect = f.SelectEffect("YanHua"), this._effect_goldeffect = f.SelectEffect("Gold"), this._effect_bosseffect = f.SelectEffect("Boss"), this._effect_jdbhzeffect = f.SelectEffect("JDBHZ"), this._effect_dowerlveffect = f.SelectEffect("DowerLv"), this._effect_pebblebaozhaeffect = f.SelectEffect("PebbleBaoZha"), this._effect_jisuieffect = f.SelectEffect("JiSui"))
        }
        get effect_likeeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_LikeEffect, () => {
                let e = this._effect_likeeffect.clone();
                return e.name = D.Name_Effect_LikeEffect,
                    e
            })
        }
        get effect_luoshuieffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_LuoShuiEffect, () => {
                let e = this._effect_luoshuieffect.clone();
                return e.name = D.Name_Effect_LuoShuiEffect,
                    e
            })
        }
        get effect_yaneffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_YanEffect, () => {
                let e = this._effect_yaneffect.clone();
                return e.name = D.Name_Effect_YanEffect,
                    e
            })
        }
        get effect_zhadaneffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_ZhaDanEffect, () => {
                let e = this._effect_zhadaneffect.clone();
                return e.name = D.Name_Effect_ZhaDanEffect,
                    e
            })
        }
        get effect_baozhaeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_BaoZhaEffect, () => {
                let e = this._effect_baozhaeffect.clone();
                return e.name = D.Name_Effect_BaoZhaEffect,
                    e
            })
        }
        get effect_dueffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_DuEffect, () => {
                let e = this._effect_dueffect.clone();
                return e.name = D.Name_Effect_DuEffect,
                    e
            })
        }
        get effect_dajieffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_DaJiEffect, () => {
                let e = this._effect_dajieffect.clone();
                return e.name = D.Name_Effect_DaJiEffect,
                    e
            })
        }
        get effect_xueeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_Xueffect, () => {
                let e = this._effect_xueeffect.clone();
                return e.name = D.Name_Effect_Xueffect,
                    e
            })
        }
        get effect_yanhuaeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_YanHuaeffect, () => {
                let e = this._effect_yanhuaeffect.clone();
                return e.name = D.Name_Effect_YanHuaeffect,
                    e
            })
        }
        get effect_goldeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_Goldeffect, () => {
                let e = this._effect_goldeffect.clone();
                return e.name = D.Name_Effect_Goldeffect,
                    e
            })
        }
        get effect_bosseffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_Effect_Bosseffect, () => {
                let e = this._effect_bosseffect.clone();
                return e.name = D.Name_Effect_Bosseffect,
                    e
            })
        }
        get effect_jdbhzeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_EffectJDBHZeffect, () => {
                let e = this._effect_jdbhzeffect.clone();
                return e.name = D.Name_EffectJDBHZeffect,
                    e
            })
        }
        get effect_dowerlveffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_EffectDowerLveffect, () => {
                let e = this._effect_dowerlveffect.clone();
                return e.name = D.Name_EffectDowerLveffect,
                    e
            })
        }
        get effect_pebblebaozhaeffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_EffectPebbleBaoZhaeffect, () => {
                let e = this._effect_pebblebaozhaeffect.clone();
                return e.name = D.Name_EffectPebbleBaoZhaeffect,
                    e
            })
        }
        get effect_jisuieffect() {
            return Laya.Pool.getItemByCreateFun(D.Name_EffectJiSuieffect, () => {
                let e = this._effect_jisuieffect.clone();
                return e.name = D.Name_EffectJiSuieffect,
                    e
            })
        }
        recover(e, t, a) {
            e == D.Name_Effect_ZhaDanEffect ? t.getComponent(C) && (t.getComponent(C).destroy(), t.getChildAt(0).getComponent(x).destroy()) : t.getComponent(S) && t.getComponent(S).destroy(),
                t.removeSelf(),
                Laya.Pool.recover(e, t)
        }
        initrecover(e, t) {
            t.removeSelf(),
                Laya.Pool.recover(e, t)
        }
    }
    D.Name_Effect_LikeEffect = "Name_Effect_LikeEffect",
        D.Name_Effect_LuoShuiEffect = "Name_Effect_LuoShuiEffect",
        D.Name_Effect_YanEffect = "Name_Effect_YanEffect",
        D.Name_Effect_ZhaDanEffect = "Name_Effect_ZhaDanEffect",
        D.Name_Effect_BaoZhaEffect = "Name_Effect_BaoZhaEffect",
        D.Name_Effect_DuEffect = "Name_Effect_DuEffect",
        D.Name_Effect_DaJiEffect = "Name_Effect_DaJiEffect",
        D.Name_Effect_Xueffect = "Name_Effect_Xueffect",
        D.Name_Effect_YanHuaeffect = "Name_Effect_YanHuaeffect",
        D.Name_Effect_Goldeffect = "Name_Effect_Goldeffect",
        D.Name_Effect_Bosseffect = "Name_Effect_Bosseffect",
        D.Name_EffectJDBHZeffect = "Name_EffectJDBHZeffect",
        D.Name_EffectDowerLveffect = "Name_EffectDowerLveffect",
        D.Name_EffectPebbleBaoZhaeffect = "Name_EffectPebbleBaoZhaeffect",
        D.Name_EffectJiSuieffect = "Name_EffectJiSuieffect";
    class M extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner
        }
        onAwake() {
            this.Target = N._Instance.Player,
                this.TargetCtrl = this.Target.getComponent(_)
        }
        onUpdate() {
            this.owner.transform.rotate(new Laya.Vector3(0, .05, 0), !1);
            let e = this.owner.transform.position;
            if (Math.abs(e.x - this.Target.transform.position.x) <= 1.3 + .09 * this.TargetCtrl.BigLv && Math.abs(e.z - this.Target.transform.position.z) <= .8 + .04 * this.TargetCtrl.BigLv && !this.TargetCtrl.IsBeAtk) {
                if (n.PlaySound("Devour"), this.owner.removeSelf(), this.Target.getComponent(_).AddTails(), n.PlayVibrateShort(), D._Instance._effect_likeeffect && i.BenchmarkLevel >= 1) {
                    let e = N._Instance.EffectBox.addChild(D._Instance.effect_likeeffect);
                    e.transform.scale = new Laya.Vector3(1 + .1 * this.TargetCtrl.BigLv, 1 + .1 * this.TargetCtrl.BigLv, 1 + .1 * this.TargetCtrl.BigLv),
                        e.addComponent(S).Target = this.owner
                }
                this.TargetCtrl.PlayMonstersAni("chirou", 3),
                    platform.getInstance().prompt("Congratulations on getting " + i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1！"),
                    N._Instance.UpdataSkinDebris(0, !1)
            }
        }
    }
    class P extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.MyTailsType = 0,
                this.Hitresult = new Laya.HitResult,
                this.weightdata = [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7]
        }
        onAwake() {
            this.Player = this.owner.parent.parent.parent.parent.parent,
                this.PlayerCtrl = this.owner.parent.parent.parent.parent.parent.getComponent(_),
                this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .1, this.owner.transform.position.z),
                this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .1, this.owner.transform.position.z)
        }
        onUpdate() {
            if (0 != this.MyTailsType ? 1 == this.MyTailsType || 2 == this.MyTailsType || 3 == this.MyTailsType || 5 == this.MyTailsType || 6 == this.MyTailsType ? (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .7), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .7)) : 4 == this.MyTailsType ? (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .73), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - .73)) : 7 == this.MyTailsType && (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - 1.2), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .225, this.owner.transform.position.z - 1.2)) : (this.StartPos = new Laya.Vector3(this.owner.transform.position.x - .5, this.owner.transform.position.y + .1, this.owner.transform.position.z), this.OverPos = new Laya.Vector3(this.owner.transform.position.x + .5, this.owner.transform.position.y + .1, this.owner.transform.position.z)), N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4 | Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5), this.Hitresult.succeeded && "JiTui" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk || this.Hitresult.succeeded && "BigJiTui" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk || this.Hitresult.succeeded && "MoGu" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk || this.Hitresult.succeeded && "Name_Effect_ZhaDanEffect" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk) {
                let e = this.Hitresult.collider.owner,
                    t = e.getComponent(C);
                if (!t.IsHitFly && !t.IsGod) {
                    if (t.IsHitFly = !0, n.PlaySound("knock_02"), D._Instance._effect_dajieffect && i.BenchmarkLevel >= 1) {
                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_dajieffect);
                        e.transform.position = new Laya.Vector3(this.Hitresult.point.x, .25, this.Hitresult.point.z),
                            e.addComponent(S)
                    }
                    let a = this.GetStrikeLv(t);
                    t.PlayPropAni("propjifei" + a, 1);
                    let s = new Laya.Vector2(0, 0),
                        o = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
                    Laya.Vector2.normalize(o, s),
                        t.BeDir = new Laya.Vector3(-s.x / (7 - (a - 1)), 0, -s.y / (7 - (a - 1)))
                }
            }
            if (this.Hitresult.succeeded && "Enemy" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk && this.IsArenaStrike(this.Hitresult.collider.owner)) {
                let e = this.Hitresult.collider.owner,
                    t = e.getComponent(T);
                if (t.IsBoss || t.IsBeAtk || t.IsGod || this.PlayerCtrl.IsAtkBoss || (t.IsBeAtk = !0, this.StrikeEnemy(e, t, !1, !1)), t.IsBoss && !t.IsBeAtk && !this.PlayerCtrl.IsAtkBoss) {
                    if (t.IsGod) {
                        if (t.CloseGod(), D._Instance._effect_jdbhzeffect && i.BenchmarkLevel >= 1) {
                            let e = N._Instance.EffectBox.addChild(D._Instance.effect_jdbhzeffect);
                            e.transform.position = new Laya.Vector3(this.Hitresult.point.x, this.Hitresult.point.y + 1, this.Hitresult.point.z),
                                e.addComponent(S)
                        }
                        this.PlayerCtrl.IsBeAtk || this.PlayerCtrl.IsGod || (this.PlayerCtrl.IsBeAtk = !0, this.AtkEnemy(this.Player, this.PlayerCtrl, !0))
                    } else this.PlayerCtrl.IsAtkBoss = !0,
                        t.IsBeAtk = !0,
                        t.BossHP -= this.PlayerCtrl.Atk,
                        this.StrikeEnemy(e, t, !0, !1);
                    v._Instance && v._Instance.BossXTTween(t.BossHP)
                }
            }
            if (this.Hitresult.succeeded && "EnemyPebble" == this.Hitresult.collider.owner.name && this.PlayerCtrl.IsAtk && !this.PlayerCtrl.IsPebbleStrike) {
                let e = this.Hitresult.collider.owner.getComponent(k);
                if (D._Instance._effect_dajieffect && i.BenchmarkLevel >= 1) {
                    let e = N._Instance.EffectBox.addChild(D._Instance.effect_dajieffect);
                    e.transform.position = new Laya.Vector3(this.Hitresult.point.x, this.Hitresult.point.y + 1, this.Hitresult.point.z),
                        e.addComponent(S)
                }
                this.PlayerCtrl.IsBeAtk || this.PlayerCtrl.IsGod || (this.PlayerCtrl.IsBeAtk = !0, this.PlayerCtrl.IsPebbleStrike = !0, this.PlayerCtrl.Atk < e.PebbleHP && this.AtkEnemy(this.Player, this.PlayerCtrl, !1)),
                    e.PebbleHP -= this.PlayerCtrl.Atk,
                    e.PebbleXTTween(this.Player)
            }
        }
        StrikeEnemy(e, t, a, s) {
            if (n.PlaySound("knock_02"), n.PlayVibrateShort(), t.BeAtkId = 0, t.BeAtkObj = this.Player, t.BeAtkObjCtrl = this.PlayerCtrl, D._Instance._effect_xueeffect && i.BenchmarkLevel >= 2) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_xueeffect);
                t.transform.position = new Laya.Vector3(this.Hitresult.point.x, 0, this.Hitresult.point.z);
                let a = this.Hitresult.point.clone(),
                    i = e.transform.position.clone(),
                    s = this.TwoPointRotation3D(a, i);
                t.transform.rotationEuler = new Laya.Vector3(0, s, 0),
                    t.addComponent(S)
            }
            let o = N._Instance.EffectBox.addChild(t.TuoWei);
            if (Laya.timer.once(2e3, this, () => {
                    o.removeSelf()
                }), 10 == this.PlayerCtrl.BigLv && 0 == t.BigLv && Math.random() > .5 && !a) {
                if (D._Instance._effect_jisuieffect && i.BenchmarkLevel >= 1 && this.IsInCamera()) {
                    let t = N._Instance.EffectBox.addChild(D._Instance.effect_jisuieffect);
                    t.transform.position = new Laya.Vector3(e.transform.position.x, .5, e.transform.position.z);
                    t.addComponent(S)
                }
                if (t.IsDie = !0, Math.random() > .5) {
                    let t = N._Instance.PropBox.addChild(m.SelectProp("SuiPian"));
                    t.transform.position = new Laya.Vector3(e.transform.position.x, 0, e.transform.position.z),
                        t.addComponent(M)
                }
                return void(e.transform.position = new Laya.Vector3(e.transform.position.x + 1e3, t.DropHeight, e.transform.position.z + 1e3))
            }
            let r = 0;
            if (a ? s ? r = 1 : (r = this.GetStrikeLv(t) - 1) <= 1 && (r = 1) : r = this.GetStrikeLv(t), t.PlayMonstersAni("jifei" + r, 1), D._Instance._effect_yaneffect && i.BenchmarkLevel >= 1) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                t.particleSystem.duration = r >= 3 ? .2 * r : 2 == r ? .5 : .4,
                    t.addComponent(S).Target = e.getChildAt(0)
            }
            let l = new Laya.Vector2(0, 0),
                h = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
            Laya.Vector2.normalize(h, l),
                i.MaxLevel <= 15 && N._Instance.IsLevelModel ? t.BeDir = new Laya.Vector3(-l.x / ((7 - (r - 1)) / 2), 0, -l.y / ((7 - (r - 1)) / 2)) : t.BeDir = new Laya.Vector3(-l.x / (7 - (r - 1)), 0, -l.y / (7 - (r - 1)))
        }
        AtkEnemy(e, t, a) {
            n.PlayVibrateShort();
            let s = N._Instance.EffectBox.addChild(t.TuoWei);
            Laya.timer.once(2e3, this, () => {
                s.removeSelf()
            });
            if (t.PlayMonstersAni("jifei1", 1), D._Instance._effect_yaneffect && i.BenchmarkLevel >= 1) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_yaneffect);
                t.particleSystem.duration = .4,
                    t.addComponent(S).Target = e.getChildAt(0)
            }
            let o = new Laya.Vector2(0, 0),
                r = new Laya.Vector2(this.owner.transform.position.x - e.transform.position.x, this.owner.transform.position.z - e.transform.position.z);
            Laya.Vector2.normalize(r, o);
            let l = 1;
            l = a ? 1 : -6,
                t.BeDir = new Laya.Vector3(o.x / (7 - (l - 1)), 0, o.y / (7 - (l - 1)))
        }
        IsArenaStrike(e) {
            if (N._Instance.IsLevelModel) return !0;
            let t = e.getComponent(T);
            return this.PlayerCtrl.IsTeam != t.IsTeam
        }
        IsInCamera() {
            let e = this.owner.transform.position.clone(),
                t = new Laya.Vector3(0, 0, 0);
            N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t);
            let a = new Laya.Vector2(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY);
            return !(a.x <= 0 || a.y <= 0 || a.x >= Laya.stage.width || a.y >= Laya.stage.height)
        }
        TwoPointRotation3D(e, t) {
            t.x -= e.x,
                t.z -= e.z;
            var a = 0;
            if (0 == t.x && 0 == t.z) return 0;
            if (t.x > 0 && t.z > 0) a = 0;
            else {
                if (t.x > 0 && 0 == t.z) return 90;
                if (t.x > 0 && t.z < 0) a = 180;
                else {
                    if (0 == t.x && t.z < 0) return 180;
                    if (t.x < 0 && t.z < 0) a = -180;
                    else {
                        if (t.x < 0 && 0 == t.z) return -90;
                        t.x < 0 && t.z > 0 && (a = 0)
                    }
                }
            }
            return Math.atan(t.x / t.z) * (360 / (2 * Math.PI)) + a
        }
        GetStrikeLv(e) {
            var t = 1;
            let a = 0;
            if (this.PlayerCtrl.IsPoison) return t;
            switch (a = Math.floor(this.PlayerCtrl.BigLv) + 1, (a -= this.weightdata[Math.floor(e.BigLv)]) <= 1 && (a = 1), a) {
                case 1:
                case 2:
                    t = 1;
                    break;
                case 3:
                case 4:
                case 5:
                    t = 2;
                    break;
                case 6:
                case 7:
                    t = 3;
                    break;
                case 8:
                case 9:
                    t = 4;
                    break;
                case 10:
                case 11:
                    t = 5
            }
            return t
        }
    }
    class _ extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.Hitresult = new Laya.HitResult,
                this.IsDie = !1,
                this.IsDrop = !1,
                this.IsGod = !1,
                this.DieType = 0,
                this.IsMove = !1,
                this.IsAtk = !1,
                this.IsBeAtk = !1,
                this.IsPoison = !1,
                this.IsAtkBoss = !1,
                this.IsTeam = !0,
                this.IsPebbleStrike = !1,
                this.BeDir = new Laya.Vector3(0, 0, 0),
                this.SkinId = 1,
                this.BeAtkId = 99,
                this.MyTailsType = 1,
                this.EatMeatNum = 0,
                this.MyHP = 0,
                this.BigLv = 0,
                this.MoveSpeed = .1,
                this.KillNum = 0,
                this.DropHeight = -3.5,
                this.Atk = 5,
                this.DowerTailsLv = 0,
                this.DowerSpeedLv = 0,
                this.DowerBigLv = 0,
                this.TipsIconPos = new Laya.Vector2(1e4, 1e4),
                this.IsDrag = !1,
                this.DragIndex = .8,
                this.DragDir = new Laya.Vector3(0, 0, 0),
                this.MoveTimer = 0
        }
        onAwake() {
            this.owner.getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1,
                this.ChildNode = this.owner.getChildAt(0),
                this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z),
                this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z),
                this.Tails = this.owner.getChildAt(0).getChildByName("Tails"),
                this.TuoWei = this.owner.getChildByName("TuoWei"),
                this.MonstersAni = this.owner.getChildAt(0).getComponent(Laya.Animator),
                this.TailsAni = this.owner.getChildAt(0).getChildByName("Tails").getComponent(Laya.Animator),
                this.PlayMonstersAni("paly idle", 1),
                this.PlayTailsAni("putong", 1),
                this.BuffSet(),
                N._Instance.IsLevelModel ? this.CreatePropertyIcon("#ffffff") : this.CreatePropertyIcon("#27ff00"),
                this.AddRankProperty(),
                N._Instance.MianType <= 2 ? this.DropHeight = -3.5 : this.DropHeight = -30
        }
        BuffSet() {
            this.DowerTailsLv = i.DowerData[0].dowerlv,
                this.DowerSpeedLv = i.DowerData[1].dowerlv,
                this.DowerBigLv = i.DowerData[2].dowerlv,
                0 == this.DowerBigLv ? this.BigLv = 0 : this.BigLv = .5 + .5 * this.DowerBigLv,
                0 != N._Instance.PlayerTrySkinId ? this.SkinId = N._Instance.PlayerTrySkinId : this.SkinId = i.SkinId,
                11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.1 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .1 * (1 + .05 * this.DowerSpeedLv),
                this.MyTailsType = N._Instance.GetAniamlTailsType(this.SkinId);
            let e = i.AniamlColorData[this.SkinId - 1].split(",");
            switch (this.ColorV4 = new Laya.Vector4(parseInt(e[0]) / 255, parseInt(e[1]) / 255, parseInt(e[2]) / 255, 1), this.AddEqTails(this.DowerTailsLv + 1), N._Instance.PlayerBuffType) {
                case 1:
                    this.AddEqTails(this.DowerTailsLv + 1 + 5),
                        N._Instance.PlayerBuffType = 0;
                    break;
                case 2:
                    this.BigLv += 5,
                        N._Instance.PlayerBuffType = 0;
                    break;
                case 3:
                    11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.12 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .12 * (1 + .05 * this.DowerSpeedLv),
                        Laya.timer.once(13e3, this, () => {
                            11 == this.SkinId || 22 == this.SkinId ? this.MoveSpeed = -.1 * (1 + .05 * this.DowerSpeedLv) : this.MoveSpeed = .1 * (1 + .05 * this.DowerSpeedLv),
                                N._Instance.PlayerBuffType = 0
                        })
            }
        }
        PlayMonstersAni(e, t) {
            this.MonstersAni.play("idle"),
                this.MonstersAni.play(e),
                this.MonstersAni.speed = t
        }
        PlayTailsAni(e, t) {
            this.TailsAni.play("putong"),
                this.TailsAni.play(e),
                this.TailsAni.speed = t
        }
        AddTails(e = !0) {
            if (e) {
                if (n.PlayVibrateShort(), D._Instance._effect_likeeffect && i.BenchmarkLevel >= 1) {
                    let e = N._Instance.EffectBox.addChild(D._Instance.effect_likeeffect);
                    e.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv),
                        e.addComponent(S).Target = this.owner
                }
                this.PlayMonstersAni("chirou", 3)
            }
            this.IsPoison = !1;
            let t = !1;
            if (this.MyHP < 10 && (this.BigLv >= 5 ? (this.EatMeatNum++, this.EatMeatNum >= 2 && (this.EatMeatNum = 0, t = !0)) : t = !0), t) {
                this.MyHP++,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0) && this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
                let e = y.SelectTails("Tails" + this.MyTailsType);
                1 == i.SkinColorId ? e.meshRenderer.material.albedoColor = this.ColorV4 : e.meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1],
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                    e.addComponent(P);
                let t = y.SelectTails("Weiba" + this.MyTailsType);
                1 == i.SkinColorId ? t.meshRenderer.material.albedoColor = this.ColorV4 : t.meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1],
                    this.Tails.getChildAt(this.MyHP).getChildAt(0).addChild(t),
                    t.addComponent(P).MyTailsType = this.MyTailsType,
                    t.transform.localPosition = new Laya.Vector3(0, 0, .55),
                    this.Tails.getChildAt(this.MyHP - 1).active = !0,
                    this.Tails.getChildAt(this.MyHP).active = !0
            }
        }
        AddEqTails(e) {
            e >= 10 && (e = 10),
                this.RemoveAllTails(),
                this.PlayMonstersAni("chirou", 3);
            for (let t = 0; t < e; t++) {
                this.MyHP++,
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0) && this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
                let e = y.SelectTails("Tails" + this.MyTailsType);
                1 == i.SkinColorId ? e.meshRenderer.material.albedoColor = this.ColorV4 : e.meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1],
                    this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                    e.addComponent(P);
                let t = y.SelectTails("Weiba" + this.MyTailsType);
                1 == i.SkinColorId ? t.meshRenderer.material.albedoColor = this.ColorV4 : t.meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1],
                    this.Tails.getChildAt(this.MyHP).getChildAt(0).addChild(t),
                    t.addComponent(P).MyTailsType = this.MyTailsType,
                    t.transform.localPosition = new Laya.Vector3(0, 0, .55),
                    this.Tails.getChildAt(this.MyHP - 1).active = !0,
                    this.Tails.getChildAt(this.MyHP).active = !0
            }
        }
        RemoveAllTails() {
            this.EatMeatNum = 0;
            for (let e = 0; e < this.Tails.numChildren; e++) {
                let t = this.Tails.getChildAt(e).getChildAt(0);
                t.numChildren > 0 && t.getChildAt(0).removeSelf(),
                    this.Tails.getChildAt(e).active = !1
            }
            this.MyHP = 0
        }
        RemoveTails() {
            this.Tails.getChildAt(this.MyHP).getChildAt(0).getChildAt(0).removeSelf(),
                this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).getChildAt(0).removeSelf();
            let e = y.SelectTails("Weiba" + this.MyTailsType);
            e.meshRenderer.material.albedoColor = this.ColorV4,
                this.Tails.getChildAt(this.MyHP - 1).getChildAt(0).addChild(e),
                e.addComponent(P).MyTailsType = this.MyTailsType,
                e.transform.localPosition = new Laya.Vector3(0, 0, .55),
                this.Tails.getChildAt(this.MyHP).active = !1,
                this.MyHP--
        }
        AddBulk(e = !0) {
            if (e && (n.PlayVibrateShort(), D._Instance._effect_likeeffect && i.BenchmarkLevel >= 1)) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_likeeffect);
                e.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv),
                    e.addComponent(S).Target = this.owner
            }
            this.IsPoison = !1,
                this.PlayMonstersAni("chirou", 3),
                this.BigLv++,
                this.BigLv >= 10 && (this.BigLv = 10),
                this.BigLv >= 7.5 && 1 == i.MaxLevel && (N._Instance.Isbfzqsw = !0)
        }
        RemoveBulk() {
            if (n.PlayVibrateShort(), D._Instance._effect_dueffect && i.BenchmarkLevel >= 3) {
                let e = N._Instance.EffectBox.addChild(D._Instance.effect_dueffect);
                e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + .5, this.owner.transform.position.z),
                    e.addComponent(S).Target = this.owner
            }
            this.IsPoison = !0,
                this.PlayMonstersAni("chirou", 3)
        }
        EatGold(e) {
            if (n.PlaySound("cion"), n.PlayVibrateShort(), this.PlayMonstersAni("chirou", 3), i.GetGold++, D._Instance._effect_goldeffect && i.BenchmarkLevel >= 2) {
                let t = N._Instance.EffectBox.addChild(D._Instance.effect_goldeffect);
                t.transform.position = new Laya.Vector3(e.transform.position.x, .6, e.transform.position.z),
                    t.addComponent(S)
            }
        }
        RegainState() {
            this.IsAtk = !1,
                this.IsAtkBoss = !1
        }
        RegainAni() {
            this.PlayTailsAni("putong", 1)
        }
        JiFei() {
            if (this.IsDrag = !1, this.DragIndex = .8, Laya.timer.clearAll(this), N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3), this.Hitresult.succeeded) {
                this.BeAtkId = 99,
                    this.IsBeAtk = !1;
                let e = this.owner.addChild(m.SelectProp("TuoWei"));
                e.transform.localPosition = new Laya.Vector3(0, .1, 0),
                    e.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                    this.TuoWei = e
            } else this.DieType = 1,
                this.IsDie = !0;
            this.IsPebbleStrike = !1
        }
        RemoveSpeed() {
            this.IsDrag = !0,
                this.DragDir = this.BeDir;
            var e = 1;
            if (Laya.timer.frameLoop(1, this,
                    function() {
                        e += .005,
                            this.BeDir = new Laya.Vector3(this.BeDir.x / e, this.BeDir.y / e, this.BeDir.z / e)
                    }), this.BeAtkObj && null != this.BeAtkObj && this.BeAtkObjCtrl && null != this.BeAtkObjCtrl && (this.MyHP > 1 || this.BigLv > 0) && this.BeAtkObjCtrl.BigLv > this.BigLv && !this.BeAtkObjCtrl.IsPoison)
                if (Math.random() > .5 && this.MyHP > 1 || this.BigLv <= 0) {
                    let e = N._Instance.PropBox.addChild(m.SelectProp("JiTui"));
                    e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.ChildNode.transform.position.y - 1.6, this.owner.transform.position.z),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        N._Instance.CreateYinYing(e),
                        this.RemoveTails()
                } else {
                    let e = N._Instance.PropBox.addChild(m.SelectProp("BigJiTui"));
                    e.transform.position = new Laya.Vector3(this.owner.transform.position.x, this.ChildNode.transform.position.y - 1.6, this.owner.transform.position.z),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        N._Instance.CreateYinYing(e),
                        this.BigLv--
                }
            this.BeAtkObj = null,
                this.BeAtkObjCtrl = null
        }
        onUpdate() {
            if (N._Instance.IsOverShow) return;
            if (N._Instance.IsLevelModel && i.MaxLevel <= 3 && !i.IsDieHit && !this.IsBeAtk && !this.IsDie && (
                    this.owner.transform.position.x >= 11.4 || this.owner.transform.position.x <= -11.4 || this.owner.transform.position.z >= 11.4 || this.owner.transform.position.z <= -11.4) && v && v._Instance) {
                this.IsMove = !1,
                    N._Instance.IsDieHit = !0,
                    i.IsDieHit = !0,
                    this.IsGod = !0,
                    v._Instance.DieBg.visible = !0,
                    v._Instance.DieTips.visible = !0;
                for (let e = 0; e < Laya.stage.numChildren; e++) "Property" == Laya.stage.getChildAt(e).name && (Laya.stage.getChildAt(e).visible = !1),
                    "CountDownLabel" == Laya.stage.getChildAt(e).name && (Laya.stage.getChildAt(e).visible = !1)
            }
            if (this.Atk = 5 + this.BigLv, N._Instance.IsStartGame) {
                let e = this.ChildNode.transform.position.clone(),
                    t = new Laya.Vector3(0, 0, 0);
                N._Instance.Camera.viewport.project(e, N._Instance.Camera.projectionViewMatrix, t),
                    this.IsPoison ? (this.PropertyBox.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 60), this.TipsIconPos = new Laya.Vector2(t.x / Laya.stage.clientScaleX + 20, t.y / Laya.stage.clientScaleY - 70)) : (this.PropertyBox.pos(t.x / Laya.stage.clientScaleX, t.y / Laya.stage.clientScaleY - 120 - 12 * this.BigLv), this.TipsIconPos = new Laya.Vector2(t.x / Laya.stage.clientScaleX + 20, t.y / Laya.stage.clientScaleY - 130 - 12 * this.BigLv))
            } else this.IsMove = !1;
            if (this.IsPoison ?
                (
                    this.owner.transform.scale = new Laya.Vector3(.5, .5, .5),
                    3 == N._Instance.PlayerBuffType ?
                    11 == this.SkinId || 22 == this.SkinId ?
                    this.MoveSpeed = -.14 * (1 + .05 * this.DowerSpeedLv) :
                    this.MoveSpeed = .14 * (1 + .05 * this.DowerSpeedLv) :
                    11 == this.SkinId || 22 == this.SkinId ?
                    this.MoveSpeed = -.12 * (1 + .05 * this.DowerSpeedLv) :
                    this.MoveSpeed = .12 * (1 + .05 * this.DowerSpeedLv)
                ) :
                (
                    this.owner.transform.scale = new Laya.Vector3(1 + .1 * this.BigLv, 1 + .1 * this.BigLv, 1 + .1 * this.BigLv),
                    3 == N._Instance.PlayerBuffType ?
                    11 == this.SkinId || 22 == this.SkinId ?
                    this.MoveSpeed = (.004 * this.BigLv - .12) * (1 + .05 * this.DowerSpeedLv) :
                    this.MoveSpeed = (.12 - .004 * this.BigLv) * (1 + .05 * this.DowerSpeedLv) :
                    11 == this.SkinId || 22 == this.SkinId ?
                    this.MoveSpeed = (.004 * this.BigLv - .1) * (1 + .05 * this.DowerSpeedLv) :
                    this.MoveSpeed = (.1 - .004 * this.BigLv) * (1 + .05 * this.DowerSpeedLv)
                ), this.StartPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y + 1, this.owner.transform.position.z),
                this.OverPos = new Laya.Vector3(this.owner.transform.position.x, this.owner.transform.position.y - .2, this.owner.transform.position.z),
                N._Instance.owner.physicsSimulation.raycastFromTo(this.StartPos, this.OverPos, this.Hitresult, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3, Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3),
                this.IsBeAtk || this.IsDie || !N._Instance.IsStartGame || (
                    this.Hitresult.succeeded && "pb_Me" == this.Hitresult.collider.owner.name.substring(0, 5) ?
                    this.IsDie = !1 :
                    (this.IsDie = !0, this.DieType = 0)
                ), this.IsDie) {
                if (!N._Instance.IsWin)
                    if (this.Hitresult.succeeded &&
                        "Drop" == this.Hitresult.collider.owner.name &&
                        !this.IsDrop && (this.IsDie = !0, this.IsDrop = !0), N._Instance.IsStartGame) {
                        N._Instance.IsStartGame = !1;
                        let e = N._Instance.EffectBox.addChild(this.TuoWei);
                        Laya.timer.once(2e3, this, () => {
                            e.removeSelf()
                        })
                    }
                if (this.IsDrop ? this.owner.transform.translate(new Laya.Vector3(0, -.03, 0), !1) : 0 == this.DieType ? (
                        this.BeAtkId = 99,
                        this.MoveTimer++,
                        this.MoveTimer <= 15 ? this.owner.transform.translate(new Laya.Vector3(0, 0, this.MoveSpeed), !0) :
                        this.owner.transform.translate(new Laya.Vector3(0, -.1, this.MoveSpeed), !0)) :
                    this.owner.transform.translate(new Laya.Vector3(0, -.3, 0), !1),
                    this.owner.transform.position.y <= -3.5 && N._Instance.MianType > 2 && (
                        N._Instance.IsStartGame = !1,
                        N._Instance.IsCameraMove = !1,
                        this.owner.transform.translate(new Laya.Vector3(0, -1, 0), !1)
                    ),
                    this.owner.transform.position.y <= this.DropHeight) {
                    if (this.owner.transform.position = new Laya.Vector3(this.owner.transform.position.x,
                            this.DropHeight,
                            this.owner.transform.position.z),
                        this.IsDie = !1,
                        n.PlayVibrateLong(),
                        Laya.timer.once(1500, this, () => {
                            N._Instance.IsLevelModel ?
                                i.MaxLevel % 10 == 7 && 7 != i.MaxLevel || 4 == i.MaxLevel ?
                                Laya.View.open("Scene/GetAwardPanel.scene", !0, ["SettleGold"]) :
                                i.MaxLevel <= 5 ?
                                Laya.View.open("Scene/OverPanel.scene") :
                                N._Instance.EnemyBox.numChildren >= 3 &&
                                N._Instance.FloorBox.numChildren >= 7.2 &&
                                !N._Instance.IsRevive ? (
                                    N._Instance.IsRevive = !0,
                                    Laya.View.open("Scene/OverPanel.scene")
                                ) : Laya.View.open("Scene/SettlePanel.scene") :
                                !N._Instance.IsOver && N._Instance.IsArenaCountDown && (Laya.View.open("Scene/OverPanel.scene")
                                    //console.log("这是不是竞技场死掉的地方呢")
                                )
                        }),
                        N._Instance.IsStartGame = !1,
                        N._Instance.IsCameraMove = !1,
                        N._Instance.MianType <= 2 && (n.PlaySound("Fall"),
                            D._Instance._effect_luoshuieffect && i.BenchmarkLevel >= 1)) {
                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_luoshuieffect);
                        e.transform.position = this.owner.transform.position,
                            e.addComponent(S)
                    }
                    n.PlaySound("fail"),
                        this.PropertyBox.visible = !1;
                    for (let e = 0; e < N._Instance.GameRankData.length; e++)
                        if (0 == N._Instance.GameRankData[e].myid && N._Instance.GameRankData[e].dienum++, N._Instance.GameRankData[e].myid == this.BeAtkId) {
                            N._Instance.GameRankData[e].killnum++,
                                N._Instance.GameRankData[e].exp += 20;
                            let t = {},
                                a = this.GetMyGameRankData();
                            t.atkicon = N._Instance.GameRankData[e].head,
                                t.atkname = N._Instance.GameRankData[e].name,
                                t.beatkicon = a.head,
                                t.beatkname = a.name,
                                N._Instance.EnemyKillData.push(t),
                                v && v._Instance && null != v._Instance.parent && v._Instance.GameRankSet(N._Instance.GameRankData);
                            break
                        }
                    if (99 == this.BeAtkId) {
                        let e = this.GetMyGameRankData(),
                            t = {};
                        t.dieicon = e.head,
                            t.diebadge = e.badge,
                            N._Instance.DieData.push(t)
                    }
                    for (let e = 0; e < N._Instance.GameRankData.length; e++)
                        if (0 == N._Instance.GameRankData[e].myid) {
                            N._Instance.GameRankData[e].islive = 0,
                                N._Instance.GameRankData[e].dietime = (new Date).getTime() / 1e3;
                            break
                        }
                    if (this.owner.active = !1, N._Instance.PlayerNum = 0, 3 == i.MaxLevel) {
                        N._Instance.IsPlayerDie = !0,
                            i.IsSW = !0;
                        let e = N._Instance.EnemyBox;
                        for (let t = 0; t < e.numChildren; t++) {
                            e.getChildAt(t).getComponent(T).Carryobbs = [.3, .7, 1, .6]
                        }
                    }
                    //console.log("失败！")
                }
            } else this.IsBeAtk ? this.IsMove && this.IsDrag ? (this.DragIndex -= .025, this.owner.transform.translate(new Laya.Vector3(this.DragDir.x * this.DragIndex, this.DragDir.y * this.DragIndex, this.DragDir.z * this.DragIndex), !1)) : this.owner.transform.translate(this.BeDir, !1) : this.IsMove && this.owner.transform.translate(new Laya.Vector3(0, 0, this.MoveSpeed), !0)
        }
        GetMyGameRankData() {
            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                if (0 == N._Instance.GameRankData[e].myid) return N._Instance.GameRankData[e]
        }
        AddRankProperty() {
            let e = {
                myid: 0
            };
            e.badge = i.Badge,
                e.badgelv = i.BadgeLv,
                e.exp = 20,
                e.name = i.Name,
                e.killnum = this.KillNum,
                e.dienum = 0,
                e.isself = 1,
                e.islive = 1,
                e.head = i.Head,
                e.dietime = 0,
                e.isteam = !0,
                N._Instance.GameRankData.push(e)
        }
        CreatePropertyIcon(e) {
            if (this.PropertyBox = Laya.stage.addChild(Laya.Pool.getItemByClass("Property", Laya.Box)), this.PropertyBox.width = 169, this.PropertyBox.height = 48, this.PropertyBox.pivot(85, 24), this.PropertyBox.zOrder = 1, this.PropertyBox.pos(1e4, 1e4), this.PropertyBox.rotation = 0, this.PropertyBox.name = "Property", this.PropertyBox.visible = !0, this.PropertyBox.numChildren <= 0) {
                let t = this.PropertyBox.addChild(new Laya.Image);
                t.skin = "res/Icon/Badge/Badge_0" + i.Badge + ".png",
                    t.width = 150,
                    t.height = 150,
                    t.pos(27, 22),
                    t.pivot(75, 75),
                    t.scale(.4, .4),
                    t.name = "BadegIcon";
                let a = this.PropertyBox.addChild(new Laya.Label);
                a.text = i.Name,
                    a.font = "SimHei",
                    a.fontSize = 18,
                    a.color = e,
                    a.align = "center",
                    a.valign = "middle",
                    a.overflow = "hidden",
                    a.width = 112,
                    a.height = 20,
                    a.pos(111, 24),
                    a.pivot(56, 10),
                    a.name = "NameLabel";
                let s = this.PropertyBox.addChild(new Laya.Image);
                s.skin = "res/Icon/JianTou.png",
                    s.width = 74,
                    s.height = 98,
                    s.pos(84.5, -25),
                    s.pivot(37, 49),
                    s.scale(.4, .4),
                    s.name = "Jiantou",
                    s.visible = !1
            } else this.PropertyBox.getChildByName("BadegIcon").skin = "res/Icon/Badge/Badge_0" + i.Badge + ".png",
                this.PropertyBox.getChildByName("NameLabel").color = e,
                this.PropertyBox.getChildByName("NameLabel").text = i.Name,
                this.PropertyBox.getChildByName("Jiantou").visible = !1
        }
    }
    class A extends Laya.Script3D {
        constructor() {
            super(),
                this.owner = this.owner
        }
        RegainState() {
            let e = this.owner.parent.parent;
            e && e.getComponent(_).RegainState()
        }
        RegainAni() {
            let e = this.owner.parent.parent;
            e && e.getComponent(_).RegainAni()
        }
    }
    class E extends Laya.Script3D {
        constructor() {
            super(),
                this.owner = this.owner
        }
        RegainState() {
            let e = this.owner.parent.parent;
            e && e.getComponent(T).RegainState()
        }
        RegainAni() {
            let e = this.owner.parent.parent;
            e && e.getComponent(T).RegainAni()
        }
    }
    class G extends Laya.Script3D {
        constructor() {
            super()
        }
        JiFei() {
            let e = this.owner.parent;
            e && e.getComponent(_).JiFei()
        }
        RemoveSpeed() {
            let e = this.owner.parent;
            e && e.getComponent(_).RemoveSpeed()
        }
    }
    class R extends Laya.Script3D {
        constructor() {
            super()
        }
        JiFei() {
            let e = this.owner.parent;
            e && e.getComponent(T).JiFei()
        }
        RemoveSpeed() {
            let e = this.owner.parent;
            e && e.getComponent(T).RemoveSpeed()
        }
    }
    class V {
        static init() {
            for (let e in V) "init" !== e && (laya.utils.Tween.prototype[e] = V[e])
        }
        static _initProps(e, t, a) {
            for (let i in t) {
                if ("number" == typeof e[i]) {
                    let s = a ? e[i] : t[i],
                        n = a ? t[i] : e[i];
                    this._props.push([i, s, n - s]),
                        a || (e[i] = s)
                }
                if (e[i] instanceof Laya.Vector4) {
                    let s = new Laya.Vector4,
                        n = a ? e[i].clone() : t[i],
                        o = a ? t[i] : e[i].clone();
                    n instanceof Laya.Vector4 || (n = new Laya.Vector4(n.x, n.y, n.z, n.w)),
                        o = new Laya.Vector4(o.x, o.y, o.z, o.w),
                        Laya.Vector4.subtract(o, n, s),
                        this._props.push([i, n, s, o]),
                        a || (e[i] = n)
                }
                if (e.transform && e.transform[i] instanceof Laya.Vector3) {
                    let s = new Laya.Vector3,
                        n = a ? e.transform[i].clone() : t[i],
                        o = a ? t[i] : e.transform[i].clone();
                    n instanceof Laya.Vector3 || (n = new Laya.Vector3(n.x, n.y, n.z)),
                        o = new Laya.Vector3(o.x, o.y, o.z),
                        Laya.Vector3.subtract(o, n, s),
                        this._props.push([i, n, s, o]),
                        a || (e[i] = n)
                }
            }
        }
        static _updateEase(e) {
            var t = this._target;
            if (t) {
                if (t.destroyed) return this.clearTween(t);
                var a = this._usedTimer = e - this._startTimer - this._delay;
                if (!(a < 0)) {
                    if (a >= this._duration) return this.complete();
                    for (var i = a > 0 ? this._ease(a, 0, 1, this._duration) : 0, s = this._props, n = 0, o = s.length; n < o; n++) {
                        var r = s[n];
                        if ("number" == typeof t[r[0]] && (t[r[0]] = r[1] + i * r[2]), t[r[0]] instanceof Laya.Vector4) {
                            let e = r[1].x + i * r[2].x,
                                a = r[1].y + i * r[2].y,
                                s = r[1].z + i * r[2].z,
                                n = r[1].w + i * r[2].w;
                            t[r[0]] = new Laya.Vector4(e, a, s, n)
                        }
                        if (t[r[0]] instanceof Laya.Vector3) {
                            let e = r[1].x + i * r[2].x,
                                a = r[1].y + i * r[2].y,
                                s = r[1].z + i * r[2].z;
                            t[r[0]] = new Laya.Vector3(e, a, s)
                        }
                        if (t.transform && t.transform[r[0]] instanceof Laya.Vector3) {
                            let e = r[1].x + i * r[2].x,
                                a = r[1].y + i * r[2].y,
                                s = r[1].z + i * r[2].z;
                            t.transform[r[0]] = new Laya.Vector3(e, a, s)
                        }
                    }
                    this.update && this.update.run()
                }
            }
        }
        static complete() {
            if (this._target) {
                Laya.timer.runTimer(this, this.firstStart);
                var e = this._complete;
                this.completData(),
                    this.update && this.update.run(),
                    this._count++,
                    0 != this.repeat && this._count >= this.repeat ? (this.clear(), e && e.run()) : this.restart()
            }
        }
        static completData() {
            for (var e = this._target,
                    t = this._props,
                    a = 0,
                    i = t.length; a < i; a++) {
                var s = t[a];
                "number" == typeof e[s[0]] && (e[s[0]] = s[1] + s[2]),
                    e[s[0]] instanceof Laya.Vector4 && (e[s[0]] = s[3]),
                    e[s[0]] instanceof Laya.Vector3 && (e[s[0]] = s[3]),
                    e.transform && e.transform[s[0]] instanceof Laya.Vector3 && (e.transform[s[0]] = s[3])
            }
        }
    }
    class H extends Laya.Script {
        constructor() {
            super()
        }
        static Init() {
            Laya.loader.create(["json/level.json", "json/skin.json"], Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            this.LevelData = Laya.loader.getRes("json/level.json"),
                i.SkinShopData = Laya.loader.getRes("json/skin.json"),
                i.LoadingNum++
                //console.log("关卡数据加载成功！", this.LevelData, i.SkinShopData)
        }
    }
    class O extends Laya.Script {
        static Init() {
            Laya.loader.create(["GameScene/Floor/Conventional/Floor.lh"], Laya.Handler.create(this, this.LoadRes))
        }
        static LoadRes() {
            this.FloorData = Laya.loader.getRes("GameScene/Floor/Conventional/Floor.lh"),
                console.log("this.FloorData:", this.FloorData),
                Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor1.lmat", Laya.Handler.create(null,
                    function(e) {
                        i.FloorMatResData.push(e),
                            Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor2.lmat", Laya.Handler.create(null,
                                function(e) {
                                    i.FloorMatResData.push(e),
                                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor3.lmat", Laya.Handler.create(null,
                                            function(e) {
                                                i.FloorMatResData.push(e),
                                                    Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor4.lmat", Laya.Handler.create(null,
                                                        function(e) {
                                                            i.FloorMatResData.push(e),
                                                                Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor5.lmat", Laya.Handler.create(null,
                                                                    function(e) {
                                                                        i.FloorMatResData.push(e),
                                                                            Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor6.lmat", Laya.Handler.create(null,
                                                                                function(e) {
                                                                                    i.FloorMatResData.push(e),
                                                                                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor7.lmat", Laya.Handler.create(null,
                                                                                            function(e) {
                                                                                                i.FloorMatResData.push(e),
                                                                                                    Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor8.lmat", Laya.Handler.create(null,
                                                                                                        function(e) {
                                                                                                            i.FloorMatResData.push(e),
                                                                                                                Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor9.lmat", Laya.Handler.create(null,
                                                                                                                    function(e) {
                                                                                                                        i.FloorMatResData.push(e),
                                                                                                                            Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/floor10.lmat", Laya.Handler.create(null,
                                                                                                                                function(e) {
                                                                                                                                    i.FloorMatResData.push(e),
                                                                                                                                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall1.lmat", Laya.Handler.create(null,
                                                                                                                                            function(e) {
                                                                                                                                                i.WallMatResData.push(e),
                                                                                                                                                    Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall2.lmat", Laya.Handler.create(null,
                                                                                                                                                        function(e) {
                                                                                                                                                            i.WallMatResData.push(e),
                                                                                                                                                                Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall3.lmat", Laya.Handler.create(null,
                                                                                                                                                                    function(e) {
                                                                                                                                                                        i.WallMatResData.push(e),
                                                                                                                                                                            Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall4.lmat", Laya.Handler.create(null,
                                                                                                                                                                                function(e) {
                                                                                                                                                                                    i.WallMatResData.push(e),
                                                                                                                                                                                        Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall5.lmat", Laya.Handler.create(null,
                                                                                                                                                                                            function(e) {
                                                                                                                                                                                                i.WallMatResData.push(e),
                                                                                                                                                                                                    Laya.BaseMaterial.load("GameScene/Floor/Conventional/Assets/material/wall6.lmat", Laya.Handler.create(null,
                                                                                                                                                                                                        function(e) {
                                                                                                                                                                                                            i.WallMatResData.push(e),
                                                                                                                                                                                                                console.log(i.FloorMatResData),
                                                                                                                                                                                                                console.log(i.WallMatResData),
                                                                                                                                                                                                                i.IsLoadFloorRes = !0,
                                                                                                                                                                                                                y.Init()
                                                                                                                                                                                                        }))
                                                                                                                                                                                            }))
                                                                                                                                                                                }))
                                                                                                                                                                    }))
                                                                                                                                                        }))
                                                                                                                                            }))
                                                                                                                                }))
                                                                                                                    }))
                                                                                                        }))
                                                                                            }))
                                                                                }))
                                                                    }))
                                                        }))
                                            }))
                                }))
                    }))
        }
        static SelectFloor(e) {
            return Laya.Sprite3D.instantiate(this.FloorData.getChildByName(e))
        }
    }
    class U extends Laya.Script {
        constructor() {
            super()
        }
        onUpdate() {
            this.Target && this.TargetCtrl && (this.Target.transform.position.y <= 0 || this.TargetCtrl.IsHitFly) && this.owner.removeSelf(),
                this.Target && null != this.Target.parent || this.owner.removeSelf()
        }
    }
    class N extends Laya.Script {
        constructor() {
            super(),
                this.owner = this.owner,
                this.IsStartGame = !1,
                this.IsOverShow = !1,
                this.IsCameraMove = !1,
                this.IsRevive = !1,
                this.IsLevelModel = !0,
                this.GameRankData = [],
                this.EnemyrandonNameData = [],
                this.EnemyrandomHeadData = [],
                this.PlayerKillData = [],
                this.EnemyKillData = [],
                this.DieData = [],
                this.PlayerNum = 0,
                this.PlayerBuffType = 0,
                this.PlayerTrySkinId = 0,
                this.IsBossRemoveHp = 1,
                this.MianType = 1,
                this.IsPlayerDie = !0,
                this.Isbfzqsw = !1,
                this.IsArenaWinState = 0,
                this.ReviveNum = 0,
                this.IsDropSP = !1,
                this.IsOver = !1,
                this.IsOneOpenTips = !1,
                this.IsArenaCountDown = !0,
                this.isArenaFinished = !1,
                this.IsCreateHint = !0,
                this.IsOverRevive = !1,
                this.IsHint = !1,
                this.IsStopGame = !1,
                this.IsWin = !1,
                this.OpenGamePanelType = 1,
                this.IsDieHit = !1,
                this.AtkPlayerPebbleObj = null,
                this.AtkEnemyPebbleObj = null,
                this.InitPos = new Laya.Vector2(0, 0),
                this.StartDelay = 3e3,
                this.CreateGoldZhadanTime = 0,
                this.CreateGoldZhadanMaxTime = 0,
                this.CreateMeatTime = 0,
                this.CreateMeatMaxTime = 0,
                this.CreateMeatIndex = 0,
                this.CreateBigMeatTime = 0,
                this.CreateBigMeatMaxTime = 0,
                this.CreateBigMeatIndex = 0,
                this.CreateMushroomTime = 0,
                this.CreateMushroomMaxTime = 0,
                this.CreateMushroomIndex = 0,
                this.CreateZhadanTime = 0,
                this.CreateZhadanMaxTime = 0,
                this.FloorDropTime = 0,
                this.FloorDropMaxTime = 0,
                this.FloorDropErMaxTime = 0,
                this.CountDownTime = 150,
                this.ArenaFloorType = 12,
                this.ArenaMyPosData = [],
                this.ArenaEnemyPosData = []
        }
        onAwake() {
            // this.owner.timer = new Laya.Timer()
            // this.owner.timer.pause()
            // console.log("asfasdfs",this.owner);
            //this.owner.scene.timer.resume()
            N._Instance = this,
                V.init(),
                this.HaiMian = this.owner.getChildByName("HaiMian"),
                this.YanJiang = this.owner.getChildByName("YanJiang"),
                this.TianKong = this.owner.getChildByName("TianKong"),
                this.XiaXue = this.owner.getChildByName("XiaXue"),
                this.XinHai = this.owner.getChildByName("XinHai"),
                this.YunHai = this.owner.getChildByName("YunHai"),
                this.XiaXue.addComponent(S),
                this.XinHai.addComponent(S),
                this.YunHai.addComponent(S),
                this.XiaXue.active = !0,
                this.XinHai.active = !0,
                this.YunHai.active = !0,
                1 == i.BenchmarkLevel && (this.XiaXue.destroy(), this.XinHai.destroy(), this.YunHai.destroy()),
                this.FloorBox = this.owner.getChildByName("FloorBox"),
                this.EnemyBox = this.owner.getChildByName("EnemyBox"),
                this.PropBox = this.owner.getChildByName("PropBox"),
                this.EffectBox = this.owner.getChildByName("EffectBox"),
                this.Camera = this.owner.getChildByName("Main Camera"),
                this.Camera.addComponent(g),
                //console.log(":asnodnsajdnsanjdiasndsa", this.Camera.transform.rotationEuler),
                this.DirectionalLight = this.owner.getChildByName("Directional Light"),
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseCtrl),
                Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseCtrl),
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseCtrl),
                i.LoadingNum++
                //console.log("场景加载成功！当前进度是：" + i.LoadingNum)
        }
        onMouseCtrl(e) {
            if (this.IsStartGame && !this.IsDieHit) {
                let t = 0,
                    a = this.Player.getComponent(_),
                    s = 1;
                switch (s = 0 != this.PlayerTrySkinId ? this.PlayerTrySkinId : i.SkinId, e.type) {
                    case Laya.Event.MOUSE_DOWN:
                        t = this.TwoPointRotation2D(new Laya.Vector2(Laya.stage.width / 2, Laya.stage.height / 2),
                                new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY)),
                            this.InitPos = new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY),
                            this.IsLevelModel ? this.Player.transform.rotationEuler = 11 == s || 22 == s ? new Laya.Vector3(0, t - 225, 0) : new Laya.Vector3(0, t - 45, 0) : this.Player.transform.rotationEuler = 11 == s || 22 == s ? new Laya.Vector3(0, t - 180, 0) : new Laya.Vector3(0, t, 0),
                            a.IsMove = !0;
                        break;
                    case Laya.Event.MOUSE_MOVE:
                        t = this.TwoPointRotation2D(this.InitPos, new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY)),
                            isNaN(t) || (this.IsLevelModel ? this.Player.transform.rotationEuler = 11 == s || 22 == s ? new Laya.Vector3(0, t - 225, 0) : new Laya.Vector3(0, t - 45, 0) : this.Player.transform.rotationEuler = 11 == s || 22 == s ? new Laya.Vector3(0, t - 180, 0) : new Laya.Vector3(0, t, 0)),
                            a.IsDrag ? a.DragDir.x <= 0 && a.DragDir.z <= 0 && t >= 0 && t <= 90 || a.DragDir.x >= 0 && a.DragDir.z <= 0 && t >= -90 && t <= 0 || a.DragDir.x >= 0 && a.DragDir.z >= 0 && t <= -90 && t >= -180 || a.DragDir.x <= 0 && a.DragDir.z >= 0 && t >= 90 && t <= 180 ? a.IsMove = !0 : a.IsMove = !1 : a.IsMove = !0;
                        break;
                    case Laya.Event.MOUSE_UP:
                        a.IsMove = !1,
                            a.IsAtk || a.IsBeAtk || (n.PlaySound("knock_01"), a.IsAtk = !0, a.PlayMonstersAni("daji", 3), a.PlayTailsAni("shuaiwei", 3))
                }
            }
        }
        LoadMonsterRes() {
            if (!i.IsLoadMonsterRes) {
                let e = [],
                    t = [];
                for (let e = 0; e < i.ReLoadMonsterResData.length; e++) t.push(i.ReLoadMonsterResData[e]);
                if (1 == i.MaxLevel) t.push(12);
                else if (2 == i.MaxLevel || 3 == i.MaxLevel) t.push(12),
                    t.push(24),
                    t.push(25);
                else if (5 == i.MaxLevel || 6 == i.MaxLevel || 7 == i.MaxLevel) t.push(8),
                    t.push(12),
                    t.push(18),
                    t.push(24),
                    t.push(25),
                    7 == i.MaxLevel && t.push(14);
                else if (8 == i.MaxLevel) t.push(1),
                    t.push(8),
                    t.push(12),
                    t.push(14),
                    t.push(17),
                    t.push(18),
                    t.push(24),
                    t.push(25);
                else if (9 == i.MaxLevel) t.push(1),
                    t.push(8),
                    t.push(12),
                    t.push(14),
                    t.push(17),
                    t.push(18),
                    t.push(24),
                    t.push(25),
                    t.push(26);
                else if (i.MaxLevel >= 10) {
                    for (let e = 1; e <= 27; e++) t.push(e);
                    i.IsLoadMonsterRes = !0
                }
                if (console.log(i.ReLoadMonsterResData, t),
                    e = o.GetArrDifference(i.ReLoadMonsterResData, t),
                    //console.log("要加载的人物列表:", e), 
                    0 != e.length) {
                    for (let t = 0; t < e.length; t++) i.ReLoadMonsterResData.push(e[t]);
                    p.Init(e, 2)
                }
            }
        }
        LoadEffectRes() {
            if (!i.IsLoadEffectRes) {
                i.IsLoadEffectRes = !0;
                let e = [];
                e = 1 == i.BenchmarkLevel ? [1, 2, 3, 4, 5, 7, 11, 13, 14, 15] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    f.Init(o.GetArrDifference(i.EffectResData, e), !1)
            }
        }
        ArenaLoadMonsterRes() {
            if (!i.IsLoadMonsterRes) {
                i.IsLoadMonsterRes = !0;
                let e = i.SkinData,
                    t = o.GetArrDifference(e, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]);
                p.Init(t, 2)
            }
        }
        StartGame() {
            this.OpenGamePanelType = 1,
                this.ReGame(),
                this.IsLevelModel = !0,
                i.MaxLevel <= 5 ? this.StartDelay = 5e3 : this.StartDelay = 3e3,
                Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                this.CreateFloor(),
                this.CreatePlayer(),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, -45, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, -45, 0),
                this.Camera.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x - 45, N._Instance.Player.getChildAt(0).transform.position.y + 60, N._Instance.Player.transform.position.z + 45),
                this.Player.getChildAt(0).getChildByName("DirSign").active = !0,
                this.Player.getComponent(_).PlayMonstersAni("chirou", 2.5),
                1 == i.MaxLevel ?
                u.MoveTo(
                    this.Camera,
                    new Laya.Vector3(
                        this.Player.transform.position.x - 10,
                        this.Player.getChildAt(0).transform.position.y + 15,
                        this.Player.transform.position.z + 10),
                    this.StartDelay,
                    Laya.Ease.cubicInOut
                ) :
                u.MoveTo(
                    this.Camera,
                    new Laya.Vector3(
                        this.Player.transform.position.x - 10,
                        this.Player.getChildAt(0).transform.position.y + 15,
                        this.Player.transform.position.z + 10),
                    this.StartDelay,
                    Laya.Ease.cubicInOut,
                    Laya.Handler.create(this, this.LevelModleStartGame)
                )
        }
        LevelModleStartGame() {
            if (this.IsOver) return;
            u.ClearTween(this.Camera),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, -45, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x - 10, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 10),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, -45, 0),
                // n.StopBGM1(),
                // n.PlayBGM(),
                this.IsStartGame = !0,
                this.IsCameraMove = !0,
                Laya.timer.clearAll(this),
                this.EnemyrandonNameData = o.GetDataRandom({
                    arry: i.EnemyNameData,
                    range: 9
                }),
                this.EnemyrandomHeadData = o.GetNonredundantNum(),
                7 == i.MaxLevel || i.MaxLevel % 10 != 7 && 4 != i.MaxLevel ? i.MaxLevel % 10 == 0 || 6 == i.MaxLevel ? (i.MaxLevel % 10 == 0 && (i.MaxLevel == i.LastLevel ? i.IsAddBossLv = !1 : (i.IsAddBossLv = !0, i.LastLevel = i.MaxLevel)), this.CreateEnemy(1, !0), this.CreateMeat(2), this.CreateMeatMaxTime = 5, this.CreateMeatIndex = 2, this.CreateBigMeatMaxTime = 10, this.CreateBigMeatIndex = 1, this.FloorDropMaxTime = 8, this.FloorDropErMaxTime = 3) : 1 == i.MaxLevel ? (this.IsPlayerDie = !1, this.CreateEnemy(2, !1), this.CreateOneLevelMeat(5), Laya.timer.once(5e3, this, () => {
                    this.CreateOneLevelBigMeat(5)
                })) : 2 == i.MaxLevel || 3 == i.MaxLevel ? (
                    this.IsPlayerDie = !1,
                    this.Isbfzqsw = !0,
                    this.CreateEnemy(3, !1),
                    this.CreateMeat(5),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 1,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1
                ) : 5 == i.MaxLevel ? (
                    this.CreateEnemy(5, !1),
                    this.CreateMeat(5),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 1,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1
                ) : 7 == i.MaxLevel ? (
                    this.CreateEnemy(5, !1),
                    this.CreateMeat(5),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 1,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1,
                    this.CreateZhadanMaxTime = 20
                ) : 8 == i.MaxLevel ? (
                    this.CreateEnemy(7, !1),
                    this.CreateMeat(5),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 1,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1,
                    this.CreateMushroom(1),
                    this.CreateMushroomMaxTime = 15,
                    this.CreateMushroomIndex = 1,
                    this.FloorDropMaxTime = 6,
                    this.FloorDropErMaxTime = 6
                ) : 9 == i.MaxLevel ? (
                    this.CreateEnemy(9, !1),
                    this.CreateMeat(5),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 1,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1,
                    this.CreateZhadanMaxTime = 20,
                    this.CreateMushroom(1),
                    this.CreateMushroomMaxTime = 15,
                    this.CreateMushroomIndex = 1,
                    this.FloorDropMaxTime = 6,
                    this.FloorDropErMaxTime = 6
                ) : (
                    this.CreateEnemy(9, !1),
                    this.CreateMeat(10),
                    this.CreateMeatMaxTime = 5,
                    this.CreateMeatIndex = 2,
                    this.CreateBigMeatMaxTime = 15,
                    this.CreateBigMeatIndex = 1,
                    this.CreateMushroom(1),
                    this.CreateMushroomMaxTime = 15,
                    this.CreateMushroomIndex = 1,
                    this.CreateZhadanMaxTime = 20,
                    this.FloorDropMaxTime = 6,
                    this.FloorDropErMaxTime = 6
                ) : (
                    this.CreateGold(),
                    this.CreateFourLevelMushroom(),
                    this.CreateGoldZhadanMaxTime = 10
                ),
                Laya.timer.loop(1e3, this, this.LoopTime)
        }
        LoopTime() {
            this.IsStopGame || (
                0 != this.CreateGoldZhadanMaxTime && (
                    this.CreateGoldZhadanTime++,
                    this.CreateGoldZhadanTime >= this.CreateGoldZhadanMaxTime && (
                        this.CreateGoldZhadanTime = 0,
                        this.CreateGoldZhadanMaxTime = 0,
                        this.CreateGoldZhaDan()
                    )
                ),
                0 != this.CreateMeatMaxTime && (
                    this.CreateMeatTime++,
                    this.CreateMeatTime >= this.CreateMeatMaxTime && (
                        this.CreateMeatTime = 0, this.CreateMeat(this.CreateMeatIndex)
                    )
                ),
                0 != this.CreateBigMeatMaxTime && (
                    this.CreateBigMeatTime++,
                    this.CreateBigMeatTime >= this.CreateBigMeatMaxTime && (
                        this.CreateBigMeatTime = 0,
                        this.CreateBigMeat(this.CreateBigMeatIndex)
                    )
                ),
                0 != this.CreateMushroomMaxTime && (
                    this.CreateMushroomTime++,
                    this.CreateMushroomTime >= this.CreateMushroomMaxTime && (
                        this.CreateMushroomTime = 0,
                        this.CreateMushroom(this.CreateMushroomIndex)
                    )
                ),
                0 != this.CreateZhadanMaxTime && (
                    this.CreateZhadanTime++,
                    this.CreateZhadanTime >= this.CreateZhadanMaxTime && (
                        this.CreateZhadanTime = 0,
                        this.CreateZhaDan()
                    )
                ),
                0 != this.FloorDropMaxTime && (
                    this.FloorDropTime++,
                    this.FloorDropTime >= this.FloorDropMaxTime && (
                        this.FloorDropTime = 0,
                        this.FloorDropMaxTime = this.FloorDropErMaxTime,
                        N._Instance.IsLevelModel ? this.FloorDropOut() : this.ArenaFloorDropOut()
                    )
                ), !N._Instance.IsLevelModel && this.IsArenaCountDown && (
                    this.CountDownTime--,
                    this.CountDownTime <= 0 && (
                        this.CountDownTime = 0,
                        N._Instance.IsOver = !0,
                        this.IsArenaCountDown = !1,
                        (N._Instance.IsOverRevive || N._Instance.IsHint) && (
                            N._Instance.IsCreateHint = !1,
                            Laya.View.open("Scene/GamePanel.scene")
                        ),
                        //console.log("结束游戏！"), 
                        this.ArenaStopGame(),
                        N._Instance.IsArenaWinState = 3,
                        v._Instance.OverGameTPTween(),
                        Laya.timer.once(2e3, this, () => {
                            Laya.View.open("Scene/ArenaSettlePanel.scene")
                        })
                    ),
                    this.CountDownTime <= 10 && 0 != this.CountDownTime && v._Instance && !v._Instance.HintBg.visible && (
                        v._Instance.djstp.visible = !0,
                        v._Instance.DownCountLabel.value = this.CountDownTime.toString(),
                        v._Instance.CountTimerLabelTween()
                    )
                )
            )
        }
        ReGame() {
            Laya.timer.clearAll(this),
                this.CreateGoldZhadanTime = 0,
                this.CreateGoldZhadanMaxTime = 0,
                this.CreateMeatTime = 0,
                this.CreateMeatMaxTime = 0,
                this.CreateMeatIndex = 0,
                this.CreateBigMeatTime = 0,
                this.CreateBigMeatMaxTime = 0,
                this.CreateBigMeatIndex = 0,
                this.CreateMushroomTime = 0,
                this.CreateMushroomMaxTime = 0,
                this.CreateMushroomIndex = 0,
                this.CreateZhadanTime = 0,
                this.CreateZhadanMaxTime = 0,
                this.FloorDropTime = 0,
                this.FloorDropMaxTime = 0,
                this.FloorDropErMaxTime = 0,
                this.IsArenaWinState = 0,
                this.CountDownTime = 150,
                this.ReviveNum = 0,
                this.IsOverShow = !1,
                this.StartDelay = 3e3,
                this.IsStartGame = !1,
                this.IsCameraMove = !1,
                this.IsRevive = !1,
                this.IsPlayerDie = !0,
                this.IsDropSP = !1,
                this.IsOver = !1,
                this.IsOneOpenTips = !1,
                this.IsCreateHint = !0,
                this.isArenaFinished = !1,
                this.IsHint = !1,
                this.IsOverRevive = !1,
                this.IsStopGame = !1,
                this.IsWin = !1,
                this.Isbfzqsw = !1,
                this.IsDieHit = !1,
                i.IsDieHit = !1,
                this.GameRankData = [],
                i.GetGold = 10,
                this.PlayerKillData = [],
                this.EnemyKillData = [],
                this.DieData = [],
                this.AtkPlayerPebbleObj = null,
                this.AtkEnemyPebbleObj = null;
            for (let e = 0; e < Laya.stage.numChildren; e++) "Property" == Laya.stage.getChildAt(e).name && (Laya.Pool.recover("Property", Laya.stage.getChildAt(e)), Laya.stage.getChildAt(e).removeSelf(), e--),
                "CountDownLabel" == Laya.stage.getChildAt(e).name && (Laya.Pool.recover("CountDownLabel", Laya.stage.getChildAt(e)), Laya.stage.getChildAt(e).removeSelf(), e--);
            this.Player && (this.PlayerNum = 0, this.Player.removeSelf());
            for (let e = 0; e < this.FloorBox.numChildren; e++) this.FloorBox.getChildAt(e).removeSelf(),
                e--;
            for (let e = 0; e < this.EnemyBox.numChildren; e++) this.EnemyBox.getChildAt(e).removeSelf(),
                e--;
            for (let e = 0; e < this.PropBox.numChildren; e++) "Name_Effect_ZhaDanEffect" != this.PropBox.getChildAt(e).name ? this.PropBox.getChildAt(e).removeSelf() : D._Instance.recover(D.Name_Effect_ZhaDanEffect, this.PropBox.getChildAt(e)),
                e--;
            for (let e = 0; e < this.EffectBox.numChildren; e++) D._Instance.recover(this.EffectBox.getChildAt(e).name, this.EffectBox.getChildAt(e)),
                e--
        }
        CreateFloor() {
            if (7 == i.MaxLevel || i.MaxLevel % 10 != 7 && 4 != i.MaxLevel)
                if (i.MaxLevel % 10 == 0 || 6 == i.MaxLevel) {
                    let e = H.LevelData;
                    for (let t = 0; t < e.length; t++)
                        if (10 == e[t].floortype) {
                            let a;
                            a = Math.random() > .5 ? e[t].floorpos1 : e[t].floorpos2;
                            for (let e = 0; e < a.length; e++) {
                                let t = this.FloorBox.addChild(O.SelectFloor("Floor5"));
                                t.transform.position = new Laya.Vector3(0, 0, 0),
                                    t.transform.rotationEuler = new Laya.Vector3(0, a[e] + 30, 0),
                                    t.addComponent(B).FloorType = 2
                            }
                            this.MianType = 1,
                                this.HaiMian.active = !0,
                                this.YanJiang.active = !1,
                                this.TianKong.active = !0,
                                this.XiaXue.active = !1,
                                this.YunHai.active = !1,
                                this.XinHai.active = !1;
                            break
                        }
                } else {
                    let e = i.MaxLevel % 10,
                        t = Math.floor(i.MaxLevel / 10);
                    8 == e || 9 == e ? 0 == t ? i.FloorSkinId = e - 1 : (t = e - 3 * t % 10, i.FloorSkinId = 0 == t ? 10 : t) : 0 == t ? i.FloorSkinId = e : (t = (i.MaxLevel - (2 * (t - 1) + 2) % 10) % 10, i.FloorSkinId = 0 == t ? 10 : t),
                        4 != i.FloorSkinId && 10 != i.FloorSkinId || (i.FloorSkinId = o.GetDataRandom({
                            arry: [1, 2, 3, 5, 6, 7, 8, 9],
                            range: 1
                        })[0]);
                    let a = 1,
                        s = 1;
                    switch (i.FloorSkinId) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            a = 1,
                                s = o.GetDataRandom({
                                    arry: [1, 2, 3],
                                    range: 1
                                })[0];
                            break;
                        case 5:
                            a = 2,
                                s = o.GetDataRandom({
                                    arry: [1, 3],
                                    range: 1
                                })[0];
                            break;
                        case 6:
                        case 7:
                            a = 3,
                                s = o.GetDataRandom({
                                    arry: [1, 2, 3],
                                    range: 1
                                })[0];
                            break;
                        case 8:
                            a = 4,
                                s = 4;
                            break;
                        case 9:
                            a = 5,
                                s = o.GetDataRandom({
                                    arry: [1, 3],
                                    range: 1
                                })[0];
                            break;
                        case 10:
                            a = 6,
                                s = o.GetDataRandom({
                                    arry: [1, 2, 3],
                                    range: 1
                                })[0]
                    }
                    switch (s) {
                        case 1:
                            this.HaiMian.active = !0,
                                this.YanJiang.active = !1,
                                this.TianKong.active = !0,
                                2 == a ? (this.XiaXue.active = !0, this.YunHai.active = !1, this.XinHai.active = !1) : (this.XiaXue.active = !1, this.YunHai.active = !1, this.XinHai.active = !1);
                            break;
                        case 2:
                            this.HaiMian.active = !1,
                                this.YanJiang.active = !0,
                                this.TianKong.active = !1,
                                this.XiaXue.active = !1,
                                this.YunHai.active = !1,
                                this.XinHai.active = !1;
                            break;
                        case 3:
                            this.HaiMian.active = !1,
                                this.YanJiang.active = !1,
                                this.TianKong.active = !0,
                                2 == a ? (this.XiaXue.active = !0, this.YunHai.active = !0, this.XinHai.active = !1) : (this.XiaXue.active = !1, this.YunHai.active = !0, this.XinHai.active = !1);
                            break;
                        case 4:
                            this.HaiMian.active = !1,
                                this.YanJiang.active = !1,
                                this.TianKong.active = !1,
                                this.XiaXue.active = !1,
                                this.YunHai.active = !1,
                                this.XinHai.active = !0
                    }
                    this.MianType = s;
                    let n = H.LevelData,
                        r = 1;
                    r = 1 == i.MaxLevel || 2 == i.MaxLevel || 3 == i.MaxLevel || 5 == i.MaxLevel || 7 == i.MaxLevel ? 20 : o.GetDataRandom({
                        arry: [1, 2, 3, 4, 5, 6, 7, 8],
                        range: 1
                    })[0];
                    for (let e = 0; e < n.length; e++)
                        if (n[e].floortype == r) {
                            let t;
                            t = Math.random() > .5 ? n[e].floorpos1 : n[e].floorpos2;
                            for (let e = 0; e < t.length; e++) {
                                let s,
                                    n,
                                    o = parseInt(t[e].split(",")[0]),
                                    r = parseInt(t[e].split(",")[1]);
                                if (parseInt(t[e].split(",")[2]) && 1 == parseInt(t[e].split(",")[2])) {
                                    let a = parseInt(t[e].split(",")[3]);
                                    (s = this.FloorBox.addChild(O.SelectFloor("Floor2"))).transform.rotationEuler = new Laya.Vector3(0, a, 0),
                                        (n = s.addComponent(B)).FloorType = 1
                                } else(s = this.FloorBox.addChild(O.SelectFloor("Floor1"))).transform.rotationEuler = new Laya.Vector3(0, 0, 0),
                                    (n = s.addComponent(B)).FloorType = 0;
                                s.transform.position = new Laya.Vector3(o, 0, r),
                                    i.FloorSkinId <= 1 && (i.FloorSkinId = 1),
                                    i.FloorSkinId >= 10 && (i.FloorSkinId = 10),
                                    s.getChildAt(0).meshRenderer.material = i.FloorMatResData[i.FloorSkinId - 1],
                                    s.getChildAt(1).meshRenderer.material = i.WallMatResData[a - 1]
                            }
                            break
                        }
                }
            else {
                let e = this.FloorBox.addChild(O.SelectFloor("Floor4"));
                e.transform.position = new Laya.Vector3(0, 0, 0),
                    e.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
                for (let t = 0; t < e.numChildren; t++) 0 != t && 1 != t && (e.getChildAt(t).getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3);
                this.MianType = 1,
                    this.HaiMian.active = !0,
                    this.YanJiang.active = !1,
                    this.TianKong.active = !0,
                    this.XiaXue.active = !1,
                    this.YunHai.active = !1,
                    this.XinHai.active = !1
            }
        }
        CreatePlayer() {
            this.PlayerNum = 1,
                this.Player = this.owner.addChild(p.SelectMonster("Monster")),
                this.Player.name = "Player",
                this.Player.transform.position = new Laya.Vector3(0, 0, 0);
            let e = 1;
            e = 0 != this.PlayerTrySkinId ? this.PlayerTrySkinId : i.SkinId;
            let t = this.Player.addChildAt(p.SelectMonster(i.AniamlResNameData[e - 1]), 0);
            t.transform.localPosition = new Laya.Vector3(0, 0, 0),
                t.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                t.getChildAt(0).meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1];
            let a = t.addChild(m.SelectProp("Tails"));
            a.transform.localPosition = new Laya.Vector3(0, 0, 0),
                a.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            let s = t.addChild(m.SelectProp("DirSign"));
            s.transform.localPosition = new Laya.Vector3(0, .05, 0),
                s.transform.localScale = new Laya.Vector3(.04, .04, .04),
                s.active = !1,
                11 == e || 22 == e ? (this.Player.transform.rotationEuler = new Laya.Vector3(0, 180, 0), s.transform.localRotationEuler = new Laya.Vector3(0, 180, 0)) : (this.Player.transform.rotationEuler = new Laya.Vector3(0, 0, 0), s.transform.localRotationEuler = new Laya.Vector3(0, 0, 0));
            let n = this.Player.addChild(m.SelectProp("TuoWei"));
            n.transform.localPosition = new Laya.Vector3(0, .1, 0),
                n.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                this.Player.addComponent(_),
                this.Player.getChildAt(0).addComponent(G),
                this.Player.getChildAt(0).getChildByName("Tails").addComponent(A)
        }
        CreateEnemy(e, t) {
            if (this.IsStartGame) {
                let a = [];
                if (1 == i.MaxLevel) a = [12, 12];
                else if (2 == i.MaxLevel || 3 == i.MaxLevel) a = [12, 24, 25];
                else if (5 == i.MaxLevel || 6 == i.MaxLevel || 7 == i.MaxLevel) a = [8, 12, 18, 24, 25];
                else if (8 == i.MaxLevel) a = [1, 8, 12, 17, 18, 24, 25];
                else if (9 == i.MaxLevel) a = [1, 8, 12, 12, 17, 18, 24, 25, 26];
                else
                    for (let e = 0; e < 3; e++)
                        for (let e = 1; e <= 27; e++) e != i.SkinId && a.push(e);
                a.sort(function() {
                    return Math.random() - .5
                });
                for (let s = 0; s < e; s++) {
                    let e = this.EnemyBox.addChild(p.SelectMonster("Monster"));
                    e.name = "Enemy",
                        e.transform.position = this.GetCreateEnemyPos(t),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0);
                    let n = e.addChildAt(p.SelectMonster(i.AniamlResNameData[a[s] - 1]), 0);
                    n.transform.localPosition = new Laya.Vector3(0, 0, 0),
                        n.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    let o = n.addChild(m.SelectProp("Tails"));
                    o.transform.localPosition = new Laya.Vector3(0, 0, 0),
                        o.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    let r = e.addChild(m.SelectProp("TuoWei"));
                    r.transform.localPosition = new Laya.Vector3(0, .1, 0),
                        r.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    let l = e.addComponent(T);
                    l.MyId = s + 1,
                        l.MyTailsType = this.GetAniamlTailsType(a[s]);
                    let h = i.AniamlColorData[a[s] - 1].split(",");
                    if (l.ColorV4 = new Laya.Vector4(parseInt(h[0]) / 255, parseInt(h[1]) / 255, parseInt(h[2]) / 255, 1), l.AddTails(!1), l.SkinId = a[s], 11 == a[s] || 22 == a[s] ? (l.MoveSpeed = -.1, l.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, 1), l.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, -2.5)) : (l.MoveSpeed = .1, l.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, -1), l.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, 2.5)), e.getChildAt(0).addComponent(R), e.getChildAt(0).getChildByName("Tails").addComponent(E), t && (l.IsBoss = !0, l.AddEqTails(5), 6 == i.MaxLevel ? (l.BigLv = 6, l.BossHP = 20 / this.IsBossRemoveHp, l.BossMaxHP = 20) : 10 == i.MaxLevel ? (l.BigLv = 6, l.BossHP = 60 / this.IsBossRemoveHp, l.BossMaxHP = 60) : 20 == i.MaxLevel ? (l.BigLv = 6, l.BossHP = 100 / this.IsBossRemoveHp, l.BossMaxHP = 100) : Math.random() >= .5 ? (l.BigLv = 3, l.BossHP = 80 / this.IsBossRemoveHp, l.BossMaxHP = 80, l.AddBaoHuZhao()) : (l.BigLv = 6, l.BossHP = 120 / this.IsBossRemoveHp, l.BossMaxHP = 120), this.IsBossRemoveHp = 1, D._Instance._effect_bosseffect && i.BenchmarkLevel >= 1)) {
                        N._Instance.EffectBox.addChild(D._Instance.effect_bosseffect).addComponent(S).Target = e.getChildAt(0)
                    }
                    i.MaxLevel > 5 && 6 != i.MaxLevel && i.MaxLevel % 10 != 7 && i.MaxLevel % 10 != 0 && (s <= 2 && (l.DowerTailsLv = Math.round(2 * Math.random() + 1), l.DowerSpeedLv = Math.round(1 * Math.random() + 2), l.DowerBigLv = Math.round(3 * Math.random() + 2)), 3 != s && 4 != s || (l.BuffType = Math.round(2 * Math.random() + 1)), l.BuffSet()),
                        l.CreatePropertyIcon("#ffffff")
                }
            }
        }
        CreateMeat(e) {
            if (this.IsStartGame)
                for (let t = 0; t < e; t++) {
                    let e = this.PropBox.addChild(m.SelectProp("JiTui")),
                        t = this.GetCreatePropPos(3);
                    t && t.x ? e.transform.position = t : e.transform.position = new Laya.Vector3(0, 0, 0),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        this.CreateYinYing(e)
                }
        }
        CreateOneLevelMeat(e) {
            if (this.IsStartGame)
                for (let t = 0; t < e; t++) {
                    let e = this.PropBox.addChild(m.SelectProp("JiTui")),
                        t = N._Instance.Player.transform.position,
                        a = 0,
                        i = 0;
                    a = Math.random() > .5 ? t.x + 1.5 + 1.5 * Math.random() : t.x - 1.5 + -1.5 * Math.random(),
                        i = Math.random() > .5 ? t.z + 1.5 + 1.5 * Math.random() : t.z - 1.5 + -1.5 * Math.random(),
                        e.transform.position = new Laya.Vector3(a, 3, i),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        this.CreateYinYing(e)
                }
        }
        CreateOneLevelBigMeat(e) {
            if (this.IsStartGame)
                for (let t = 0; t < e; t++) {
                    let e = this.PropBox.addChild(m.SelectProp("BigJiTui")),
                        t = N._Instance.Player.transform.position,
                        a = 0,
                        i = 0;
                    a = Math.random() > .5 ? t.x + 1.5 + 1.5 * Math.random() : t.x - 1.5 + -1.5 * Math.random(),
                        i = Math.random() > .5 ? t.z + 1.5 + 1.5 * Math.random() : t.z - 1.5 + -1.5 * Math.random(),
                        e.transform.position = new Laya.Vector3(a, 3, i),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        this.CreateYinYing(e)
                }
        }
        CreateBigMeat(e) {
            if (this.IsStartGame)
                for (let t = 0; t < e; t++) {
                    let e = this.PropBox.addChild(m.SelectProp("BigJiTui"));
                    e.transform.position = this.GetCreatePropPos(3),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        this.CreateYinYing(e)
                }
        }
        CreateMushroom(e) {
            if (this.IsStartGame)
                for (let t = 0; t < e; t++) {
                    let e = this.PropBox.addChild(m.SelectProp("MoGu"));
                    e.transform.position = this.GetCreatePropPos(3),
                        e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                        e.addComponent(C),
                        e.getChildAt(0).addComponent(x),
                        this.CreateYinYing(e)
                }
        }
        CreateFourLevelMushroom() {
            if (this.IsStartGame) {
                let e = this.PropBox.addChild(m.SelectProp("MoGu"));
                e.transform.position = new Laya.Vector3(0, 0, 3),
                    e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                    e.addComponent(C),
                    e.getChildAt(0).addComponent(x),
                    this.CreateYinYing(e)
            }
        }
        CreateZhaDan() {
            if (this.IsStartGame && (this.CreateZhadanMaxTime -= 5, this.CreateZhadanMaxTime <= 5 && (this.CreateZhadanMaxTime = 5), D._Instance._effect_zhadaneffect)) {
                let e = this.PropBox.addChild(D._Instance.effect_zhadaneffect);
                e.transform.position = this.GetCreatePropPos(0),
                    e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                    e.transform.scale = new Laya.Vector3(1, 1, 1),
                    e.addComponent(C).IsGod = !1,
                    e.getChildAt(0).addComponent(x)
            }
        }
        CreateGoldZhaDan() {
            if (this.IsStartGame && D._Instance._effect_zhadaneffect) {
                let e = this.PropBox.addChild(D._Instance.effect_zhadaneffect);
                e.transform.position = new Laya.Vector3(0, 0, 0),
                    e.transform.rotationEuler = new Laya.Vector3(0, 360 * Math.random(), 0),
                    e.transform.scale = new Laya.Vector3(1.43, 1.43, 1.43),
                    e.addComponent(C).IsGod = !0,
                    e.getChildAt(0).addComponent(x)
            }
        }
        CreateGold() {
            if (this.IsStartGame) {
                let e = H.LevelData;
                for (let t = 0; t < e.length; t++)
                    if (9 == e[t].floortype) {
                        let a;
                        a = 4 == i.MaxLevel ? e[t].floorpos2 : Math.random() > .5 ? e[t].floorpos1 : e[t].floorpos2;
                        for (let e = 0; e < a.length; e++) {
                            let t = parseInt(a[e].split(",")[0]),
                                i = parseInt(a[e].split(",")[1]),
                                s = this.PropBox.addChild(m.SelectProp("Gold"));
                            s.transform.position = new Laya.Vector3(t, .6, i),
                                s.transform.rotationEuler = new Laya.Vector3(0, 0, 0),
                                s.addComponent(C)
                        }
                        break
                    }
            }
        }
        CreateYinYing(e) {
            if (3 == i.BenchmarkLevel) {
                let t = this.PropBox.addChild(m.SelectProp("YinYing"));
                t.transform.position = new Laya.Vector3(e.transform.position.x, .05, e.transform.position.z),
                    t.transform.rotationEuler = new Laya.Vector3(0, e.transform.rotationEuler.y - 50, 0);
                let a = t.addComponent(U);
                a.Target = e,
                    a.TargetCtrl = e.getComponent(C)
            }
        }
        GetCreateEnemyPos(e) {
            if (e) {
                let e = Math.round(Math.random() * (this.FloorBox.numChildren - 1));
                for (let t = 0; t < this.FloorBox.numChildren; t++)
                    if (t == e) {
                        let e = this.FloorBox.getChildAt(t);
                        switch (Math.round(e.transform.rotationEuler.y)) {
                            case 0:
                                return new Laya.Vector3(-6, 0, -1.5);
                            case 30:
                                return new Laya.Vector3(-4.5, 0, -4.5);
                            case 60:
                                return new Laya.Vector3(-1.5, 0, -6);
                            case 90:
                                return new Laya.Vector3(1.5, 0, -6);
                            case 120:
                                return new Laya.Vector3(4.5, 0, -4.5);
                            case 150:
                                return new Laya.Vector3(6, 0, -1.5);
                            case 180:
                                return new Laya.Vector3(6, 0, 1.5);
                            case 210:
                                return new Laya.Vector3(4, 0, 4);
                            case 240:
                                return new Laya.Vector3(1.5, 0, 5.5);
                            case 270:
                                return new Laya.Vector3(-1.5, 0, 5.5);
                            case 300:
                                return new Laya.Vector3(-4, 0, 4);
                            case 330:
                                return new Laya.Vector3(-5.5, 0, 1.5)
                        }
                    }
                return new Laya.Vector3(-6, 0, -1.5)
            } {
                let e = [];
                for (let t = 0; t < this.FloorBox.numChildren; t++) {
                    let a = this.FloorBox.getChildAt(t);
                    0 == a.getComponent(B).FloorType && e.push(a.transform.position)
                }
                let t = o.GetDataRandom({
                    arry: e,
                    range: 1
                })[0];
                return new Laya.Vector3(t.x + (8.4 * Math.random() - 4.2), 0, t.z + (8.4 * Math.random() - 4.2))
            }
        }
        GetCreatePropPos(e) {
            let t = Math.round(Math.random() * (this.FloorBox.numChildren - 1));
            for (let a = 0; a < this.FloorBox.numChildren; a++)
                if (a == t) {
                    let t = this.FloorBox.getChildAt(a),
                        i = t.getComponent(B);
                    if (i) switch (i.FloorType) {
                        case 0:
                            return new Laya.Vector3(t.transform.position.x + (8.4 * Math.random() - 4.2), e, t.transform.position.z + (8.4 * Math.random() - 4.2));
                        case 1:
                            let a = [4, 3.7, 3.4, 3.1, 2.8, 2.5, 2.2, 1.9, 1.8, 1.5, 1.2, 1, .7, .5, .25, 0],
                                s = [4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, .5, 0, -.5, -1, -1.5, -2, -2.5, -3],
                                n = Math.round(15 * Math.random());
                            switch (Math.round(t.transform.rotationEuler.y)) {
                                case 0:
                                    return new Laya.Vector3(t.transform.position.x + (Math.random() * (2 * a[n]) - a[n]), e, t.transform.position.z + s[n]);
                                case 90:
                                    return new Laya.Vector3(t.transform.position.x + s[n], e, t.transform.position.z + (Math.random() * (2 * a[n]) - a[n]));
                                case 180:
                                    return new Laya.Vector3(t.transform.position.x + (Math.random() * (2 * a[n]) - a[n]), e, t.transform.position.z + -s[n]);
                                case -90:
                                    return new Laya.Vector3(t.transform.position.x + -s[n], e, t.transform.position.z + (Math.random() * (2 * a[n]) - a[n]))
                            }
                            break;
                        case 2:
                            let o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                r = [0, -.6, -1.2, -1.7, -2.4, -3, -3.5, -4, -3.4],
                                l = Math.round(8 * Math.random());
                            switch (Math.round(t.transform.rotationEuler.y)) {
                                case 0:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, -.6, -1.2, -1.7, -2.4, -3, -3.5, -4, -3.4],
                                        new Laya.Vector3(t.transform.position.x + l + 1, e, t.transform.position.z + Math.random() * r[l] - o[l]);
                                case 30:
                                    return l = Math.round(7 * Math.random()),
                                        o = [.7, 1.4, 2, 2.5, 3.1, 3.7, 4.4, 4.9],
                                        r = [-.8, -1.7, -2.8, -4, -5.2, -4, -2.3, -.6],
                                        new Laya.Vector3(t.transform.position.x + l + 1, e, t.transform.position.z + Math.random() * r[l] - o[l]);
                                case 60:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, .6, 1.2, 1.7, 2.4, 3, 3.5, 4, 3.4],
                                        new Laya.Vector3(t.transform.position.x + Math.random() * r[l] + o[l], e, t.transform.position.z - (l + 1));
                                case 90:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, -.6, -1.2, -1.7, -2.4, -3, -3.5, -4, -3.4],
                                        new Laya.Vector3(t.transform.position.x + Math.random() * r[l] - o[l], e, t.transform.position.z - (l + 1));
                                case 120:
                                    return l = Math.round(7 * Math.random()),
                                        o = [.7, 1.4, 2, 2.5, 3.1, 3.7, 4.4, 4.9],
                                        r = [-.8, -1.7, -2.8, -4, -5.2, -4, -2.3, -.6],
                                        new Laya.Vector3(t.transform.position.x - (l + 1), e, t.transform.position.z + Math.random() * r[l] - o[l]);
                                case 150:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, -.6, -1.2, -1.7, -2.4, -3, -3.5, -4, -3.4],
                                        new Laya.Vector3(t.transform.position.x - (l + 1), e, t.transform.position.z + Math.random() * r[l] - o[l]);
                                case 180:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, .6, 1.2, 1.7, 2.4, 3, 3.5, 4, 3.4],
                                        new Laya.Vector3(t.transform.position.x - (l + 1), e, t.transform.position.z + Math.random() * r[l] + o[l]);
                                case 210:
                                    return l = Math.round(7 * Math.random()),
                                        o = [.7, 1.4, 2, 2.5, 3.1, 3.7, 4.4, 4.9],
                                        r = [.8, 1.7, 2.8, 4, 5.2, 4, 2.3, .6],
                                        new Laya.Vector3(t.transform.position.x - (l + 1), e, t.transform.position.z + Math.random() * r[l] + o[l]);
                                case 240:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, -.6, -1.2, -1.7, -2.4, -3, -3.5, -4, -3.4],
                                        new Laya.Vector3(t.transform.position.x + Math.random() * r[l] - o[l], e, t.transform.position.z + (l + 1));
                                case 270:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, .6, 1.2, 1.7, 2.4, 3, 3.5, 4, 3.4],
                                        new Laya.Vector3(t.transform.position.x + Math.random() * r[l] + o[l], e, t.transform.position.z + (l + 1));
                                case 300:
                                    return l = Math.round(7 * Math.random()),
                                        o = [.7, 1.4, 2, 2.5, 3.1, 3.7, 4.4, 4.9],
                                        r = [.8, 1.7, 2.8, 4, 5.2, 4, 2.3, .6],
                                        new Laya.Vector3(t.transform.position.x + Math.random() * r[l] + o[l], e, t.transform.position.z + (l + 1));
                                case 330:
                                    return l = Math.round(8 * Math.random()),
                                        o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                        r = [0, .6, 1.2, 1.7, 2.4, 3, 3.5, 4, 3.4],
                                        new Laya.Vector3(t.transform.position.x + l + 1, e, t.transform.position.z + Math.random() * r[l] + o[l])
                            }
                            return l = Math.round(8 * Math.random()),
                                o = [.3, .3, .3, .3, .3, .3, .3, .3, .3],
                                r = [0, .6, 1.2, 1.7, 2.4, 3, 3.5, 4, 3.4],
                                new Laya.Vector3(t.transform.position.x + l + 1, e, t.transform.position.z + Math.random() * r[l] + o[l])
                    }
                }
            return new Laya.Vector3(0, 0, 0)
        }
        FloorDropOut() {
            if (this.FloorBox.numChildren > 1 && this.IsStartGame) {
                this.FloorBox.getChildAt(this.FloorBox.numChildren - 1).getComponent(B).IsDrop = !0
            }
        }
        ArenaStartGame() {
            c.SendMsgToServer([{
                        key: "scene",
                        value: 11
                    },
                    {
                        key: "event_code",
                        value: 2
                    }
                ]),
                this.OpenGamePanelType = 3,
                this.ReGame(),
                this.IsLevelModel = !1,
                this.isArenaFinished = !1,
                Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                this.CreateArenaFloor(),
                this.CreateArenaPlayer(),
                this.CreateArenaEnemy(9),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, 0, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0),
                this.Camera.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.getChildAt(0).transform.position.y + 45, N._Instance.Player.transform.position.z + 45),
                this.Player.getChildAt(0).getChildByName("DirSign").active = !0,
                u.MoveTo(this.Camera, new Laya.Vector3(this.Player.transform.position.x, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 15), 3e3, Laya.Ease.cubicInOut, Laya.Handler.create(this, this.ArenaModleStartGame))
        }
        ArenaModleStartGame() {
            u.ClearTween(this.Camera),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 15),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, 0, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0),
                // n.StopBGM1(),
                // n.PlayBGM(),
                this.IsStartGame = !0,
                this.IsCameraMove = !0,
                Laya.timer.clearAll(this);
            for (let e = 0; e < this.EnemyBox.numChildren; e++) {
                this.EnemyBox.getChildAt(e).getComponent(T).SeekEnemy()
            }
            this.CreateMeat(10),
                this.CreateMeatMaxTime = 5,
                this.CreateMeatIndex = 2,
                this.CreateBigMeatMaxTime = 15,
                this.CreateBigMeatIndex = 1,
                this.CreateMushroom(1),
                this.CreateMushroomMaxTime = 15,
                this.CreateMushroomIndex = 1,
                15 != this.ArenaFloorType && (this.CreateZhadanMaxTime = 20),
                this.FloorDropMaxTime = 6,
                this.FloorDropErMaxTime = 6,
                this.IsArenaCountDown = !0,
                this.CountDownTime = 150,
                Laya.timer.loop(1e3, this, this.LoopTime)
        }
        CreateArenaFloor() {
            let e = o.GetDataRandom({
                    arry: [1, 2, 3, 5, 6, 7, 8, 9],
                    range: 1
                })[0],
                t = 1,
                a = 1;
            switch (e) {
                case 1:
                case 2:
                case 3:
                case 4:
                    t = 1,
                        a = o.GetDataRandom({
                            arry: [1, 2, 3],
                            range: 1
                        })[0];
                    break;
                case 5:
                    t = 2,
                        a = o.GetDataRandom({
                            arry: [1, 3],
                            range: 1
                        })[0];
                    break;
                case 6:
                case 7:
                    t = 3,
                        a = o.GetDataRandom({
                            arry: [1, 2, 3],
                            range: 1
                        })[0];
                    break;
                case 8:
                    t = 4,
                        a = 4;
                    break;
                case 9:
                    t = 5,
                        a = o.GetDataRandom({
                            arry: [1, 3],
                            range: 1
                        })[0];
                    break;
                case 10:
                    t = 6,
                        a = o.GetDataRandom({
                            arry: [1, 2, 3],
                            range: 1
                        })[0]
            }
            switch (a) {
                case 1:
                    this.HaiMian.active = !0,
                        this.YanJiang.active = !1,
                        this.TianKong.active = !0,
                        2 == t ? (this.XiaXue.active = !0, this.YunHai.active = !1, this.XinHai.active = !1) : (this.XiaXue.active = !1, this.YunHai.active = !1, this.XinHai.active = !1);
                    break;
                case 2:
                    this.HaiMian.active = !1,
                        this.YanJiang.active = !0,
                        this.TianKong.active = !1,
                        this.XiaXue.active = !1,
                        this.YunHai.active = !1,
                        this.XinHai.active = !1;
                    break;
                case 3:
                    this.HaiMian.active = !1,
                        this.YanJiang.active = !1,
                        this.TianKong.active = !0,
                        2 == t ? (this.XiaXue.active = !0, this.YunHai.active = !0, this.XinHai.active = !1) : (this.XiaXue.active = !1, this.YunHai.active = !0, this.XinHai.active = !1);
                    break;
                case 4:
                    this.HaiMian.active = !1,
                        this.YanJiang.active = !1,
                        this.TianKong.active = !1,
                        this.XiaXue.active = !1,
                        this.YunHai.active = !1,
                        this.XinHai.active = !0
            }
            this.MianType = a;
            let s = H.LevelData,
                n = o.GetDataRandom({
                    arry: [12, 13, 14],
                    range: 1
                })[0];
            this.ArenaFloorType = n;
            for (let a = 0; a < s.length; a++)
                if (s[a].floortype == n) {
                    if (15 != n) {
                        let n = s[a].floorpos;
                        for (let a = 0; a < n.length; a++) {
                            let s,
                                o,
                                r = parseInt(n[a].split(",")[0]),
                                l = parseInt(n[a].split(",")[1]);
                            (s = this.FloorBox.addChild(O.SelectFloor("Floor1"))).transform.rotationEuler = new Laya.Vector3(0, 0, 0),
                                (o = s.addComponent(B)).FloorType = 0,
                                s.transform.position = new Laya.Vector3(-r, 0, l),
                                e <= 1 && (e = 1),
                                e >= 10 && (e = 10),
                                s.getChildAt(0).meshRenderer.material = i.FloorMatResData[e - 1],
                                s.getChildAt(1).meshRenderer.material = i.WallMatResData[t - 1]
                        }
                        let o = s[a].PebblePosData;
                        for (let e = 0; e < o.length; e++)
                            if (0 == e) {
                                let t,
                                    a = parseInt(o[e].split(",")[0]),
                                    i = parseInt(o[e].split(",")[1]);
                                (t = this.PropBox.addChild(m.SelectProp("PlayerPebble"))).transform.position = new Laya.Vector3(a, -1, i),
                                    t.transform.rotationEuler = new Laya.Vector3(0, 45, 0),
                                    t.addComponent(k).SetPebbleTP(!0)
                            } else if (1 == e) {
                            let t,
                                a = parseInt(o[e].split(",")[0]),
                                i = parseInt(o[e].split(",")[1]);
                            (t = this.PropBox.addChild(m.SelectProp("EnemyPebble"))).transform.position = new Laya.Vector3(a, -1, i),
                                t.transform.rotationEuler = new Laya.Vector3(0, 45, 0),
                                t.addComponent(k).SetPebbleTP(!1)
                        }
                    } else {
                        let e = this.FloorBox.addChild(O.SelectFloor("Floor4"));
                        e.transform.position = new Laya.Vector3(0, 0, 0),
                            e.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
                        for (let t = 0; t < e.numChildren; t++) 0 != t && 1 != t && (e.getChildAt(t).getComponent(Laya.PhysicsCollider).collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3);
                        let t = s[a].floorpos;
                        for (let e = 0; e < t.length; e++) {
                            let a = this.FloorBox.addChild(O.SelectFloor("Floor5"));
                            a.transform.position = new Laya.Vector3(0, -.01, 0),
                                a.transform.rotationEuler = new Laya.Vector3(0, t[e] + 30, 0),
                                a.addComponent(B).FloorType = 2
                        }
                    }
                    this.ArenaMyPosData = s[a].MyPosData,
                        this.ArenaEnemyPosData = s[a].EnemyPosData;
                    break
                }
        }
        CreateArenaPlayer() {
            this.PlayerNum = 1,
                this.Player = this.owner.addChild(p.SelectMonster("Monster")),
                this.Player.name = "Player";
            let e = parseInt(this.ArenaMyPosData[0].split(",")[0]),
                t = parseInt(this.ArenaMyPosData[0].split(",")[1]),
                a = parseInt(this.ArenaMyPosData[0].split(",")[2]);
            this.Player.transform.position = new Laya.Vector3(-e, 0, t);
            let s = this.Player.addChildAt(p.SelectMonster(i.AniamlResNameData[i.SkinId - 1]), 0);
            s.transform.localPosition = new Laya.Vector3(0, 0, 0),
                s.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                s.getChildAt(0).meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1];
            let n = s.addChild(m.SelectProp("Tails"));
            n.transform.localPosition = new Laya.Vector3(0, 0, 0),
                n.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
            let o = s.addChild(m.SelectProp("DirSign"));
            o.transform.localPosition = new Laya.Vector3(0, .05, 0),
                o.transform.localScale = new Laya.Vector3(.04, .04, .04),
                o.active = !1,
                11 == i.SkinId || 22 == i.SkinId ? (this.Player.transform.rotationEuler = new Laya.Vector3(0, a - 180, 0), o.transform.localRotationEuler = new Laya.Vector3(0, 180, 0)) : (this.Player.transform.rotationEuler = new Laya.Vector3(0, a, 0), o.transform.localRotationEuler = new Laya.Vector3(0, 0, 0));
            let r = this.Player.addChild(m.SelectProp("TuoWei"));
            r.transform.localPosition = new Laya.Vector3(0, .1, 0),
                r.transform.localRotationEuler = new Laya.Vector3(0, 0, 0),
                this.Player.addComponent(_),
                this.Player.getChildAt(0).addComponent(G),
                this.Player.getChildAt(0).getChildByName("Tails").addComponent(A)
        }
        CreateArenaEnemy(e) {
            let t = [];
            for (let e = 1; e <= 27; e++) e != i.SkinId && 11 != e && 22 != e && t.push(e);
            t.sort(function() {
                return Math.random() - .5
            });
            let a = !1;
            for (let s = 0; s < e; s++) {
                a = s <= 3;
                let e = this.EnemyBox.addChild(p.SelectMonster("Monster"));
                e.name = "Enemy";
                let n = [],
                    o = 0;
                a ? (n = this.ArenaMyPosData, o = s + 1) : (n = this.ArenaEnemyPosData, o = s - 4);
                let r = parseInt(n[o].split(",")[0]),
                    l = parseInt(n[o].split(",")[1]),
                    h = parseInt(n[o].split(",")[2]);
                e.transform.position = new Laya.Vector3(-r, 0, l);
                let c = e.addChildAt(p.SelectMonster(i.AniamlResNameData[t[s] - 1]), 0);
                c.transform.localPosition = new Laya.Vector3(0, 0, 0),
                    c.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let d = c.addChild(m.SelectProp("Tails"));
                d.transform.localPosition = new Laya.Vector3(0, 0, 0),
                    d.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let y = e.addChild(m.SelectProp("TuoWei"));
                y.transform.localPosition = new Laya.Vector3(0, .1, 0),
                    y.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let f = e.addComponent(T);
                f.InitPos = new Laya.Vector2(-r, l),
                    f.IsTeam = a,
                    f.MyId = s + 1,
                    f.MyTailsType = this.GetAniamlTailsType(t[s]);
                let S = i.AniamlColorData[t[s] - 1].split(",");
                f.ColorV4 = new Laya.Vector4(parseInt(S[0]) / 255, parseInt(S[1]) / 255, parseInt(S[2]) / 255, 1),
                    f.AddTails(!1),
                    f.SkinId = t[s],
                    11 == t[s] || 22 == t[s] ? (e.transform.rotationEuler = new Laya.Vector3(0, h - 180, 0), f.InitRot = h - 180, f.MoveSpeed = -.1, f.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, 1), f.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, -2.5)) : (e.transform.rotationEuler = new Laya.Vector3(0, h, 0), f.InitRot = h, f.MoveSpeed = .1, f.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, -1), f.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, 2.5)),
                    e.getChildAt(0).addComponent(R),
                    e.getChildAt(0).getChildByName("Tails").addComponent(E),
                    this.IsLevelModel ? f.CreatePropertyIcon("#ffffff") : a ? f.CreatePropertyIcon("#27ff00") : f.CreatePropertyIcon("#ff0a00")
            }
        }
        ArenaPlayerRevive() {
            this.OpenGamePanelType = 4;
            let e = parseInt(this.ArenaMyPosData[0].split(",")[0]),
                t = parseInt(this.ArenaMyPosData[0].split(",")[1]),
                a = parseInt(this.ArenaMyPosData[0].split(",")[2]);
            this.Player.transform.position = new Laya.Vector3(-e, 0, t),
                11 == i.SkinId || 22 == i.SkinId ? this.Player.transform.rotationEuler = new Laya.Vector3(0, a - 180, 0) : this.Player.transform.rotationEuler = new Laya.Vector3(0, a, 0),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, 0, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x, this.Player.getChildAt(0).transform.position.y + 5.5, this.Player.transform.position.z + 5.5),
                this.Player.active = !0,
                this.PlayerNum = 1;
            let s = this.Player.getComponent(_);
            s.IsBeAtk = !1,
                s.IsGod = !0,
                s.BuffSet(),
                s.PlayMonstersAni("chirou", 2.5);
            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                if (0 == N._Instance.GameRankData[e].myid) {
                    N._Instance.GameRankData[e].islive = 1;
                    break
                }
            if (u.MoveTo(this.Camera, new Laya.Vector3(this.Player.transform.position.x, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 15), 3e3, Laya.Ease.cubicInOut, Laya.Handler.create(this, this.ArenaModleRevive)), D._Instance._effect_dowerlveffect && this.IsInCamera(this.Player) && i.BenchmarkLevel >= 1) {
                let e = this.EffectBox.addChild(D._Instance.effect_dowerlveffect);
                e.transform.position = this.Player.transform.position,
                    Laya.timer.once(1e3, this, () => {
                        D._Instance.recover(D.Name_EffectDowerLveffect, e)
                    })
            }
            // console.log("Arena竞技场复活");
            // console.log("Arena竞技场复活.isArenaFinished="+N._Instance.isArenaFinished);
            if (this.isArenaFinished) {
                Laya.View.open("Scene/ArenaSettlePanel.scene")
            }
        }
        ArenaModleRevive() {
            u.ClearTween(this.Camera),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 15),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, 0, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0);
            let e = this.Player.getComponent(_);
            e.PropertyBox.visible = !0,
                e.IsDie = !1,
                e.IsDrop = !1,
                e.IsPoison = !1,
                e.IsBeAtk = !1,
                e.BeAtkId = 99,
                e.IsGod = !1,
                this.IsStartGame = !0,
                this.IsCameraMove = !0
        }
        ArenaEnemyRevive(e) {
            Laya.timer.once(1e4, this, () => {
                let t = this.EnemyBox.addChild(p.SelectMonster("Monster"));
                t.name = "Enemy",
                    t.transform.position = new Laya.Vector3(e.posx, 0, e.posz),
                    t.transform.rotationEuler = new Laya.Vector3(0, e.rot, 0);
                let a = t.addChildAt(p.SelectMonster(i.AniamlResNameData[e.skinid - 1]), 0);
                a.transform.localPosition = new Laya.Vector3(0, 0, 0),
                    a.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let s = a.addChild(m.SelectProp("Tails"));
                s.transform.localPosition = new Laya.Vector3(0, 0, 0),
                    s.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let n = t.addChild(m.SelectProp("TuoWei"));
                n.transform.localPosition = new Laya.Vector3(0, .1, 0),
                    n.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                let o = t.addComponent(T);
                o.InitPos = new Laya.Vector2(e.posx, e.posz),
                    o.InitRot = e.rot,
                    o.IsTeam = e.isteam,
                    o.MyId = e.myid,
                    o.MyTailsType = this.GetAniamlTailsType(e.skinid);
                let r = i.AniamlColorData[e.skinid - 1].split(",");
                if (o.ColorV4 = new Laya.Vector4(parseInt(r[0]) / 255, parseInt(r[1]) / 255, parseInt(r[2]) / 255, 1), o.AddTails(!1), o.SkinId = e.skinid, 11 == e.skinid || 22 == e.skinid ? (o.MoveSpeed = -.1, o.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, 1), o.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, -2.5)) : (o.MoveSpeed = .1, o.Start1Pos.transform.localPosition = new Laya.Vector3(0, 6, -1), o.Over1Pos.transform.localPosition = new Laya.Vector3(0, -.2, 2.5)), t.getChildAt(0).addComponent(R), t.getChildAt(0).getChildByName("Tails").addComponent(E), this.IsLevelModel) o.CreatePropertyIcon("#ffffff");
                else {
                    let t = {};
                    t.badge = e.badge,
                        t.badgelv = e.badgelv,
                        t.name = e.name,
                        t.head = e.head,
                        t.killnum = e.killnum,
                        t.dienum = e.dienum,
                        t.isteam = e.isteam,
                        e.isteam ? o.CreatePropertyIcon("#27ff00", t) : o.CreatePropertyIcon("#ff0a00", t)
                }
                o.SeekEnemy();
                for (let e = 0; e < this.PropBox.numChildren; e++) {
                    let t = this.PropBox.getChildAt(e).getComponent(C);
                    t && t.GetToTarget()
                }
                if (D._Instance._effect_dowerlveffect && this.IsInCamera(t) && i.BenchmarkLevel >= 1) {
                    let e = this.EffectBox.addChild(D._Instance.effect_dowerlveffect);
                    e.transform.position = t.transform.position,
                        Laya.timer.once(1e3, this, () => {
                            D._Instance.recover(D.Name_EffectDowerLveffect, e)
                        })
                }
            })
        }
        ArenaFloorDropOut() {
            let e = 25;
            switch (this.ArenaFloorType) {
                case 12:
                    e = 25;
                    break;
                case 13:
                case 14:
                    e = 23;
                    break;
                case 15:
                    e = 1
            }
            if (this.FloorBox.numChildren > e && this.IsStartGame) {
                this.FloorBox.getChildAt(this.FloorBox.numChildren - 1).getComponent(B).IsDrop = !0
            }
        }
        ArenaStopGame() {
            this.isArenaFinished = !0;
            this.Player && (this.Player.getComponent(_).IsBeAtk = !1),
                Laya.timer.clearAll(this),
                this.IsStartGame = !1,
                this.IsCameraMove = !1;
            for (let e = 0; e < this.EnemyBox.numChildren; e++) {
                let t = this.EnemyBox.getChildAt(e),
                    a = t.getComponent(T);
                t && a && (u.ClearTween(t), Laya.timer.clearAll(a), a.IsOverGame = !0, a.MoveSpeed = 0, a.IsBeAtk = !1)
            }
        }
        Revive() {
            this.OpenGamePanelType = 2;
            let e = [];
            for (let t = 0; t < this.FloorBox.numChildren; t++) {
                let a = this.FloorBox.getChildAt(t),
                    i = a.getComponent(B);
                i && 0 == i.FlashIndex && e.push(a.transform.position)
            }
            let t = o.GetDataRandom({
                arry: e,
                range: 1
            })[0];
            this.Player.transform.position = new Laya.Vector3(t.x, 0, t.z);
            let a = 1;
            a = 0 != this.PlayerTrySkinId ? this.PlayerTrySkinId : i.SkinId,
                this.Player.transform.rotationEuler = 11 == a || 22 == a ? new Laya.Vector3(0, 180, 0) : new Laya.Vector3(0, 0, 0),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, -45, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, -45, 0),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x - 5.5, this.Player.getChildAt(0).transform.position.y + 8.64, this.Player.transform.position.z + 5.5),
                this.Player.active = !0,
                this.PlayerNum = 1;
            let s = this.Player.getComponent(_);
            s.IsBeAtk = !1,
                s.IsGod = !0,
                s.PlayMonstersAni("chirou", 2.5);
            for (let e = 0; e < N._Instance.GameRankData.length; e++)
                if (0 == N._Instance.GameRankData[e].myid) {
                    N._Instance.GameRankData[e].islive = 1;
                    break
                }
            u.MoveTo(this.Camera, new Laya.Vector3(this.Player.transform.position.x - 10, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 10), 3e3, Laya.Ease.cubicInOut, Laya.Handler.create(this, this.LevelModleRevive))

            if (N._Instance.IsLevelModel && N._Instance.EnemyBox.numChildren <= 0 && N._Instance.Player) {
                //console.log("胜利！"),
                n.PlaySound("victory");
                Laya.timer.once(1e3, this, () => {
                    N._Instance.IsOverShow = !0;
                    for (let e = 0; e < N._Instance.GameRankData.length; e++) {
                        if (0 == N._Instance.GameRankData[e].myid) {
                            N._Instance.GameRankData[e].exp += 100;
                            break
                        }
                    }
                    if (6 == i.MaxLevel || i.MaxLevel % 10 == 0) {
                        let e = [100];
                        if (Math.random() >= .5 ? e.push(150) : e.push(50), Math.random() >= .9) {
                            e.push(1);
                            let t = N._Instance.PropBox.addChild(m.SelectProp("SuiPian"));
                            t.transform.position = new Laya.Vector3(this.owner.transform.position.x - 3 * Math.random(), 0, this.owner.transform.position.z - 3 * Math.random()),
                                t.addComponent(w)
                        }
                        Laya.View.open("Scene/GetAwardPanel.scene", !0, ["Boss", e])
                    } else Laya.View.open("Scene/SettlePanel.scene")
                    //v._Instance.OpenWinTP();

                    if (D._Instance._effect_yanhuaeffect && i.BenchmarkLevel >= 2) {
                        let e = N._Instance.EffectBox.addChild(D._Instance.effect_yanhuaeffect);
                        e.transform.position = new Laya.Vector3(N._Instance.Player.transform.position.x, N._Instance.Player.transform.position.y + 5, N._Instance.Player.transform.position.z),
                            e.addComponent(S)
                    }
                })
            }
        }
        LevelModleRevive() {
            u.ClearTween(this.Camera),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(this.DirectionalLight.transform.rotationEuler.x, -45, this.DirectionalLight.transform.rotationEuler.z),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, -45, 0),
                this.Camera.transform.position = new Laya.Vector3(this.Player.transform.position.x - 10, this.Player.getChildAt(0).transform.position.y + 15, this.Player.transform.position.z + 10);
            let e = this.Player.getComponent(_);
            e.PropertyBox.visible = !0,
                e.IsDie = !1,
                e.IsDrop = !1,
                e.IsPoison = !1,
                e.IsBeAtk = !1,
                e.BeAtkId = 99,
                e.IsGod = !1,
                this.IsStartGame = !0,
                this.IsCameraMove = !0
        }
        IsInCamera(e) {
            let t = e.transform.position.clone(),
                a = new Laya.Vector3(0, 0, 0);
            this.Camera.viewport.project(t, this.Camera.projectionViewMatrix, a);
            let i = new Laya.Vector2(a.x / Laya.stage.clientScaleX, a.y / Laya.stage.clientScaleY);
            return !(i.x <= 100 || i.y <= 100 || i.x >= Laya.stage.width - 100 || i.y >= Laya.stage.height - 100)
        }
        GetAniamlTailsType(e) {
            switch (e) {
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 12:
                case 13:
                case 14:
                case 15:
                case 17:
                case 18:
                case 20:
                case 21:
                case 24:
                case 25:
                case 27:
                    return 1;
                case 10:
                    return 2;
                case 1:
                case 16:
                    return 3;
                case 11:
                case 22:
                    return 4;
                case 19:
                    return 5;
                case 26:
                    return 6;
                case 23:
                    return 7
            }
        }
        UpdateBadgeLv(e, t = !0) {
            if (i.Exp += e, r.save_int("Exp", i.Exp), 7 == i.Badge && 5 == i.BadgeLv) return !1; {
                let e = i.Badge,
                    s = i.BadgeLv;
                for (var a = !1; i.Exp >= i.MaxExp;) i.Exp >= i.MaxExp && (i.Exp -= i.MaxExp, a = !0, i.Badge <= 2 ? i.BadgeLv < 4 ? i.BadgeLv++ : 4 == i.BadgeLv && (i.Badge++, i.BadgeLv = 1) : i.BadgeLv < 5 ? i.BadgeLv++ : 5 == i.BadgeLv && (7 == i.Badge ? (i.Badge = 7, i.BadgeLv = 5) : (i.Badge++, i.BadgeLv = 1)), r.save_int("Exp", i.Exp), r.save_int("Badge", i.Badge), r.save_int("BadgeLv", i.BadgeLv), i.Badge <= 2 ? 1 == i.Badge && 1 == i.BadgeLv ? i.MaxExp = 500 : 4 == i.BadgeLv ? i.MaxExp = 1e3 * (i.Badge + 1) : i.MaxExp = 1e3 * i.Badge : 5 == i.BadgeLv ? i.MaxExp = 1e3 * (i.Badge + 1) : i.MaxExp = 1e3 * i.Badge);
                if (t) return !!a && (Laya.timer.once(300, this, () => {
                    Laya.View.open("Scene/BadgeLvPanel.scene", !1, [e, s])
                }), !0)
            }
        }
        UpdateLevel() {
            i.MaxLevel++,
                //console.log("更新关卡", i.MaxLevel),
                r.save_int("MaxLevel", i.MaxLevel);
            let e = {};
            e.level = i.MaxLevel,
                e.issharegold = !1,
                e.issharediamond = !1,
                i.SettleShareData = e;
            let t = JSON.stringify(i.SettleShareData);
            r.save_string("SettleShareData", t)
        }
        UpdateGold(e) {
            i.Gold += e,
                r.save_int("Gold", i.Gold)
        }
        UpdateDiamond(e) {
            i.Diamond += e,
                r.save_int("Diamond", i.Diamond)
        }
        UpdatePower(e) {
            i.Power += e,
                i.Power >= i.MaxPower && (i.Power = i.MaxPower, i.PowerTimeStamp = 0),
                i.Power <= i.MaxPower && 0 == i.PowerTimeStamp && (i.PowerTimeStamp = (new Date).getTime() / 1e3),
                r.save_int("PowerTimeStamp", i.PowerTimeStamp),
                r.save_int("Power", i.Power)
        }
        UnLockSkin(e) {
            let t = !1;
            for (let a = 0; a < i.ReLoadMonsterResData.length; a++)
                if (i.ReLoadMonsterResData[a] == e) {
                    t = !0;
                    break
                }
            t || (i.ReLoadMonsterResData.push(e), p.Init([e], 2)),
                i.SkinData.push(e);
            let a = JSON.stringify(i.SkinData);
            r.save_string("SkinData", a);
            let s = {};
            s.skinid = e,
                s.userid = 1;
            let n = [];
            for (let e = 1; e <= 6; e++) {
                let t = {};
                t.skinid = s.skinid,
                    t.colorid = e,
                    1 == e ? (t.isuser = 1, t.islock = 1) : (t.isuser = 0, t.islock = 0),
                    n.push(t)
            }
            s.skincolordata = n,
                i.SkinColorData.push(s);
            let o = JSON.stringify(i.SkinColorData);
            r.save_string("SkinColorData", o)
        }
        UnLockColorSkin(e, t) {
            for (let a = 0; a < i.SkinColorData.length; a++)
                if (i.SkinColorData[a].skinid == e) {
                    let e = i.SkinColorData[a].skincolordata;
                    for (let a = 0; a < e.length; a++)
                        if (e[a].colorid == t) {
                            e[a].islock = 1,
                                platform.getInstance().prompt("Congratulations on getting new colorful skin！");
                            break
                        }
                }
            let a = JSON.stringify(i.SkinColorData);
            r.save_string("SkinColorData", a)
        }
        AlterSkin(e) {
            i.SkinId = e,
                r.save_int("SkinId", i.SkinId),
                platform.getInstance().prompt("Success!")
        }
        AlterColorSkin(e, t, a) {
            for (let s = 0; s < i.SkinColorData.length; s++)
                if (i.SkinColorData[s].skinid == e) {
                    let e = i.SkinColorData[s].skincolordata;
                    for (let s = 0; s < e.length; s++) e[s].colorid == t ? (e[s].isuser = 1, a && (i.SkinColorId = t)) : e[s].isuser = 0
                }
            let s = JSON.stringify(i.SkinColorData);
            r.save_string("SkinColorData", s),
                a && r.save_int("SkinColorId", i.SkinColorId)
        }
        UpdateDowerLv(e) {
            for (let t = 0; t < i.DowerData.length; t++)
                if (i.DowerData[t].dowertype == e) {
                    i.DowerData[t].dowerlv++;
                    break
                }
            let t = JSON.stringify(i.DowerData);
            r.save_string("DowerData", t)
        }
        UpdateSignData() {
            i.IsSign = 1,
                i.ZeroTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400,
                r.save_int("ZeroTimeStamp", i.ZeroTimeStamp),
                i.NextSignDay++,
                r.save_int("NextSignDay", i.NextSignDay)
        }
        UpdataSkinDebris(e, t = !0) {
            let a = i.SkinDebrisOrderData[i.SkinDebrisOrderIndex];
            for (let s = 0; s < i.SkinDebrisData.length; s++)
                if (i.SkinDebrisData[s].skinid == a) {
                    i.SkinDebrisData[s].debrisnum++,
                        i.SkinDebrisData[s].debrisnum >= 5 && (t ? Laya.timer.once(300, this, () => {
                            Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Skin", i.SkinDebrisData[s].skinid, 1, e])
                        }) : (i.IsNewSkin = !0, platform.getInstance().prompt("All pieces are collected, congratulations on getting " + i.AniamlNameData[i.SkinDebrisData[s].skinid - 1] + "x1！Please check in your skin！"), N._Instance.UnLockSkin(i.SkinDebrisData[s].skinid)));
                    break
                }
            let s = JSON.stringify(i.SkinDebrisData);
            r.save_string("SkinDebrisData", s),
                i.SkinDebrisOrderIndex++,
                r.save_int("SkinDebrisOrderIndex", i.SkinDebrisOrderIndex)
        }
        UpdateInviteNum(e) {
            i.NextInviteNum += e,
                r.save_int("NextInviteNum", i.NextInviteNum)
        }
        TwoPointRotation2D(e, t) {
            let a = t.x - e.x,
                i = t.y - e.y,
                s = Math.abs(i) / Math.abs(a),
                n = 0;
            return i >= 0 && a <= 0 ? n = 180 * Math.atan(s) / Math.PI - 90 : i >= 0 && a >= 0 ? n = 90 - 180 * Math.atan(s) / Math.PI : i <= 0 && a <= 0 ? n = 180 * -Math.atan(s) / Math.PI - 90 : i <= 0 && a >= 0 && (n = 180 * Math.atan(s) / Math.PI + 90),
                n
        }
        PlayInitEffect() {
            this.XiaXue.active = !1,
                this.XinHai.active = !1,
                this.YunHai.active = !1;
            let e = this.owner.addChild(new Laya.Sprite3D);
            if (e.transform.position = new Laya.Vector3(0, 0, 0), D._Instance._effect_likeeffect) {
                var t = e.addChild(D._Instance.effect_likeeffect);
                t.transform.position = new Laya.Vector3(100, 100, 100)
            }
            if (D._Instance._effect_luoshuieffect) {
                var a = e.addChild(D._Instance.effect_luoshuieffect);
                a.transform.position = new Laya.Vector3(100, 100, 100)
            }
            if (D._Instance._effect_yaneffect) {
                var s = e.addChild(D._Instance.effect_yaneffect);
                s.transform.position = new Laya.Vector3(100, 100, 100)
            }
            Laya.timer.once(500, this, () => {
                    t && D._Instance.initrecover(D.Name_Effect_LikeEffect, t),
                        a && D._Instance.initrecover(D.Name_Effect_LuoShuiEffect, a),
                        s && D._Instance.initrecover(D.Name_Effect_YanEffect, s)
                }),
                Laya.timer.once(1e3, this, () => {
                    if (D._Instance._effect_zhadaneffect) {
                        var t = e.addChild(D._Instance.effect_zhadaneffect);
                        t.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_baozhaeffect && i.BenchmarkLevel >= 1) {
                        var a = e.addChild(D._Instance.effect_baozhaeffect);
                        a.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_dueffect) {
                        var s = e.addChild(D._Instance.effect_dueffect);
                        s.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    Laya.timer.once(500, this, () => {
                        t && D._Instance.initrecover(D.Name_Effect_ZhaDanEffect, t),
                            a && D._Instance.initrecover(D.Name_Effect_BaoZhaEffect, a),
                            s && D._Instance.initrecover(D.Name_Effect_DuEffect, s)
                    })
                }),
                Laya.timer.once(2e3, this, () => {
                    if (D._Instance._effect_dajieffect) {
                        var t = e.addChild(D._Instance.effect_dajieffect);
                        t.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_xueeffect) {
                        var a = e.addChild(D._Instance.effect_xueeffect);
                        a.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_jdbhzeffect) {
                        var i = e.addChild(D._Instance.effect_jdbhzeffect);
                        i.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_dowerlveffect) {
                        var s = e.addChild(D._Instance.effect_dowerlveffect);
                        s.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    Laya.timer.once(500, this, () => {
                        t && D._Instance.initrecover(D.Name_Effect_DaJiEffect, t),
                            a && D._Instance.initrecover(D.Name_Effect_Xueffect, a),
                            i && D._Instance.initrecover(D.Name_EffectJDBHZeffect, i),
                            s && D._Instance.initrecover(D.Name_EffectDowerLveffect, s)
                    })
                }),
                Laya.timer.once(3e3, this, () => {
                    if (D._Instance._effect_yanhuaeffect) {
                        var t = e.addChild(D._Instance.effect_yanhuaeffect);
                        t.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_goldeffect) {
                        var a = e.addChild(D._Instance.effect_goldeffect);
                        a.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_bosseffect) {
                        var i = e.addChild(D._Instance.effect_bosseffect);
                        i.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    if (D._Instance._effect_pebblebaozhaeffect) {
                        var s = e.addChild(D._Instance.effect_pebblebaozhaeffect);
                        s.transform.position = new Laya.Vector3(100, 100, 100)
                    }
                    Laya.timer.once(500, this, () => {
                        t && D._Instance.initrecover(D.Name_Effect_YanHuaeffect, t),
                            a && D._Instance.initrecover(D.Name_Effect_Goldeffect, a),
                            i && D._Instance.initrecover(D.Name_Effect_Bosseffect, i),
                            s && D._Instance.initrecover(D.Name_EffectPebbleBaoZhaeffect, s),
                            e.removeSelf()
                    })
                })
        }
    }
    class z extends e.Scene.StartPanelUI {
        constructor() {
            super(),
                this.IsJbTween = !1,
                this.isOpenAward = false,
                this.IsBossTween = !1,
                this.IsSusTween = !1,
                this.isOpenAward = false,
                this.IsGiftTween = !1,
                this.IsSkinHDTween = !1,
                this.IsDinWeiTween = !1,
                this.TipsInitPosy = 0,
                this.TipsData = ["A big piece of meat makes me grow bigger quickly", "Little burgers make me longer", "When I grow bigger, I will have more strength！", "Start now!", "I'm not a snake", "Eat a little more and you'll grow up", "Become longer and stronger!", "I must get penta kill today!", "Would I be more handsome if I changed my skin", "Well, if I don't win, I'll be shame.", "upgrade the skills to become more powerful~", "Upgrade the skills can help me win！", "I envy those with high skill levels！"],
                this.GiftData = [
                    [100, 1, 0, 20],
                    [50, 0, 0, 50],
                    [100, 0, 5, 100],
                    [50, 0, 0, 20],
                    [100, 0, 0, 50],
                    [50, 0, 5, 100],
                    [50, 0, 0, 20],
                    [50, 0, 0, 50],
                    [100, 0, 5, 100],
                    [50, 1, 0, 20],
                    [50, 0, 0, 50],
                    [100, 0, 5, 100],
                    [50, 0, 0, 20],
                    [100, 0, 0, 50],
                    [50, 0, 5, 100],
                    [100, 0, 0, 20],
                    [100, 0, 0, 50],
                    [50, 0, 5, 100],
                    [100, 0, 0, 20],
                    [100, 0, 0, 50],
                    [50, 1, 5, 100]
                ],
                this.IsConutTimer = !1,
                this.IsGiftConutTimer = !1,
                this.IsOpen = !1,
                this.MiniGameData = [],
                this.CurrSusBannerIndex = 100
        }
        onAwake() {
            z._Instance = this,
                i.IsLoadRes || (i.IsLoadRes = !0, O.Init()),
                i.IsAuthor || "Player" != i.Name || "res/Icon/Head/yktp.jpg" != i.Head || X.CreateAuthorBtn(),
                this.GameClubBtn = X.CreateGameClubBtn(),
                // n.StopBGM1(),
                // n.PlayBGM1(),
                s.MatchScreen(this, this.Bg),
                s.TopUIMatch(this.TopBox, 0),
                s.AddBtnAnimation([this.StartGameBtn, this.MoreGameBtn, this.SusBannerBtn, this.DowerBtn, this.GiftBtn, this.SetBtn, this.RankBtn, this.SignBtn, this.LotteryBtn, this.SkinBtn, this.ShopBtn, this.ArenaBtn]),
                this.StartGameBtn.on(Laya.Event.CLICK, this, this.StartGame),
                this.SetBtn.on(Laya.Event.CLICK, this, this.Set),
                this.RankBtn.on(Laya.Event.CLICK, this, this.Rank),
                this.SignBtn.on(Laya.Event.CLICK, this, this.Sign),
                this.LotteryBtn.on(Laya.Event.CLICK, this, this.Lottery),
                this.SkinBtn.on(Laya.Event.CLICK, this, this.Skin),
                this.ShopBtn.on(Laya.Event.CLICK, this, this.Shop),
                this.ArenaBtn.on(Laya.Event.CLICK, this, this.Arena),
                this.GiftBtn.on(Laya.Event.CLICK, this, this.Gift),
                //this.MiniGameBtn.on(Laya.Event.CLICK, this, this.MiniGame),
                //this.BackBtn.on(Laya.Event.CLICK, this, this.Back),
                this.DowerBtn.on(Laya.Event.CLICK, this, this.Dower),
                this.MoreGameBtn.on(Laya.Event.CLICK, this, this.MoreGame),
                this.GiftTipsTP.on(Laya.Event.CLICK, this, this.GiftTipsCloseTween),
                this.RankTipsTP.on(Laya.Event.CLICK, this, this.RankTipsTPCloseTween),
                this.SkinTipsTP.on(Laya.Event.CLICK, this, this.SkinTipsTPCloseTween),
                this.ShopTipsTP.on(Laya.Event.CLICK, this, this.ShopTipsTPCloseTween),
                this.StartGameBtnTween(),
                this.CreateScene3D(),
                this.PowerRefresh(),
                this.GiftRefresh(),
                this.Refresh(),
                Laya.timer.frameLoop(1, this, this.Update),
                i.MaxLevel <= 10 ? (i.MaxLevel >= 4 ? this.ThreeTP.visible = !0 : this.ThreeTP.visible = !1, i.MaxLevel > 4 ? this.ThreeBox.visible = !1 : this.ThreeBox.visible = !0, this.IsJbTween = !0, i.MaxLevel >= 6 ? this.FiveTP.visible = !0 : this.FiveTP.visible = !1, i.MaxLevel > 6 ? this.FiveBox.visible = !1 : this.FiveBox.visible = !0, this.IsBossTween = !0) : (this.ThreeBox.visible = !1, this.FiveBox.visible = !1),
                4 == i.MaxLevel || 6 == i.MaxLevel || i.MaxLevel % 10 == 0 || i.MaxLevel % 10 == 7 && 7 != i.MaxLevel ? this.DinWeiTP.visible = !1 : (this.DinWeiTP.visible = !0, this.MyIcon.skin = i.Head, this.IsDinWeiTween = !0, this.DinWeiTween()),
                1 == i.ExportSwitch && 1 == i.StartSwitch && i.MiniGameData.length > 0 && this.MiniGame(!1),
                Laya.stage.addChild(this.MiniGameBox),
                L.BannerShowData[0] = !0,
                L.CreateBannerAd("adunit-0838107b25da5ad4"),
                a.IsIphoneX ? (
                    this.BottomBox.bottom = 290,
                    this.GiftBtn.bottom = 625,
                    this.RightBox.centerY = -230,
                    //this.MiniGameBox.centerY = -230, 
                    this.SusBannerBtn.centerY = -360
                ) : (
                    this.BottomBox.bottom = 230,
                    this.GiftBtn.bottom = 565,
                    this.RightBox.centerY = -170,
                    //this.MiniGameBox.centerY = -170, 
                    this.SusBannerBtn.centerY = -300
                ),
                i.SusGameData.length > 0 && 1 == i.ExportSwitch && 1 == i.StartSusSwitch && (1 == i.SusGameData.length ? this.SusBannerBtn.visible = !0 : (this.SusBannerBtn.visible = !0, this.AlterApp(), this.IsSusTween = !0)),
                Laya.timer.loop(2e3, this, this.UITween),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 10
                    }
                ]),
                i.IsOpenShouZhi && (i.IsOpenShouZhi = !1, this.skeleton1 = new Laya.Skeleton, this.ShouZhiBox.addChild(this.skeleton1), this.skeleton1.pos(0, 0), this.skeleton1.scale(.5, .5), this.skeleton1.load("res/UIEffect/ShouZhiEffect/dianjid.sk", new Laya.Handler(this, () => {
                        this.skeleton1.play(0, !0)
                    },
                    null, !0))),
                this.MoreGameBtn.visible = !1
        }
        UITween() {
            this.JbTPTween(),
                this.BossTPTween(),
                this.MFTPTween(),
                this.MoreGameTween(),
                this.IsJbTween && this.JbTP1Tween(),
                this.IsBossTween && this.BossTP1Tween(),
                this.IsSusTween && this.SusTween1(),
                this.IsGiftTween && this.GiftTween(),
                this.IsSkinHDTween && this.SkinHDTween(),
                this.IsDinWeiTween && this.DinWeiTween()
        }
        onOpened(e) {
            let t = !0;
            for (let e = 0; e < i.SkinData.length; e++)
                if (14 == i.SkinData[e]) {
                    t = !1;
                    break
                }
            e && 2 == e[0] && (Laya.stage.addChild(this.ShopTipsTP), this.ShopTipsTPTween(), this.GiftTipsTP && this.GiftTipsTP.removeSelf()),
                e && 1 == e[0] && 0 == e[1] && (Laya.stage.addChild(this.SkinTipsTP), this.SkinTipsTPTween(), this.GiftTipsTP && this.GiftTipsTP.removeSelf()),
                e && 1 == e[0] && 1 == e[1] && (Laya.stage.addChild(this.RankTipsTP), this.RankTipsTPTween(), this.GiftTipsTP && this.GiftTipsTP.removeSelf()),
                e && (1 == e[0] || 2 == e[0]) && 0 == i.IsRefuseYQ && Math.random() > .8 ? (this.PlayerActiveCtrl(!1), Laya.View.open("Scene/TeamInvitePanel.scene", !1)) : e && 1 == e[0] && i.MaxLevel > 7 && t || e && 2 == e[0] && i.MaxLevel > 7 && t ? Laya.View.open("Scene/MFSkinPanel.scene") : e && 1 == e[0] && i.MaxLevel > 3 && Math.random() >= .5 && (L.IsShowStartInterstitialAd = !0, L.CreateInterstitialAd("adunit-2ee06bee7c4fb32d"))
        }
        CreateScene3D() {
            this.Scene3D = Laya.stage.addChild(new Laya.Scene3D),
                this.Camera = this.Scene3D.addChild(new Laya.Camera),
                this.Camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY,
                this.Camera.transform.position = new Laya.Vector3(0, 4.5, 7),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-30, 0, 0),
                this.DirectionalLight = this.Scene3D.addChild(new Laya.DirectionLight),
                this.DirectionalLight.transform.position = new Laya.Vector3(0, 0, 0),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(-66, 15, 0),
                this.DirectionalLight.color = new Laya.Vector3(.8392157, .9667342, 1),
                this.DirectionalLight.intensity = .8,
                this.Player = this.Scene3D.addChild(p.SelectMonster(i.AniamlResNameData[i.SkinId - 1])),
                this.Player.getChildAt(0).meshRenderer.material = i.AniamlMatResData[i.SkinColorId - 1],
                this.Player.transform.rotationEuler = new Laya.Vector3(0, -25, 0);
            let e = 1,
                t = 200;
            switch (i.SkinId) {
                case 1:
                    this.Player.transform.position = new Laya.Vector3(.1, .2, 0),
                        e = .8,
                        t = 180;
                    break;
                case 2:
                    this.Player.transform.position = new Laya.Vector3(.1, .4, 0),
                        e = 1,
                        t = 160;
                    break;
                case 3:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .7,
                        t = 215;
                    break;
                case 4:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .78,
                        t = 215;
                    break;
                case 5:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .9,
                        t = 210;
                    break;
                case 6:
                    this.Player.transform.position = new Laya.Vector3(.1, .4, 0),
                        e = .95,
                        t = 160;
                    break;
                case 7:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .93,
                        t = 215;
                    break;
                case 8:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .9,
                        t = 190;
                    break;
                case 9:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .82,
                        t = 215;
                    break;
                case 10:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = .85,
                        t = 190;
                    break;
                case 11:
                    this.Player.transform.position = new Laya.Vector3(.1, .2, 0),
                        this.Player.transform.rotationEuler = new Laya.Vector3(0, -200, 0),
                        e = .82,
                        t = 190;
                    break;
                case 12:
                    this.Player.transform.position = new Laya.Vector3(.1, .3, 0),
                        e = 1,
                        t = 160;
                    break;
                case 13:
                    this.Player.transform.position = new Laya.Vector3(.1, -.1, 0),
                        e = .95,
                        t = 210;
                    break;
                case 14:
                    this.Player.transform.position = new Laya.Vector3(.2, .35, 0),
                        e = .77,
                        t = 170;
                    break;
                case 15:
                    this.Player.transform.position = new Laya.Vector3(.15, .2, 0),
                        e = .87,
                        t = 195;
                    break;
                case 16:
                    this.Player.transform.position = new Laya.Vector3(.15, .1, 0),
                        e = .85,
                        t = 180;
                    break;
                case 17:
                    this.Player.transform.position = new Laya.Vector3(.1, .2, 0),
                        e = .85,
                        t = 190;
                    break;
                case 18:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = .9,
                        t = 200;
                    break;
                case 19:
                    this.Player.transform.position = new Laya.Vector3(.1, .2, 0),
                        e = .92,
                        t = 195;
                    break;
                case 20:
                    this.Player.transform.position = new Laya.Vector3(.1, .3, 0),
                        e = .85,
                        t = 180;
                    break;
                case 21:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = .78,
                        t = 195;
                    break;
                case 22:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        this.Player.transform.rotationEuler = new Laya.Vector3(0, -200, 0),
                        e = .73,
                        t = 200;
                    break;
                case 23:
                    this.Player.transform.position = new Laya.Vector3(.1, .7, 0),
                        e = 1,
                        t = 110;
                    break;
                case 24:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = 1,
                        t = 180;
                    break;
                case 25:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = .95,
                        t = 190;
                    break;
                case 26:
                    this.Player.transform.position = new Laya.Vector3(.1, 0, 0),
                        e = .95,
                        t = 220;
                    break;
                case 27:
                    this.Player.transform.position = new Laya.Vector3(.1, .1, 0),
                        e = .9,
                        t = 200
            }
            this.Player.getChildAt(0).transform.scale = new Laya.Vector3(e, e, e),
                this.Player.getChildAt(1).transform.scale = new Laya.Vector3(e, e, e);
            let s = this.Player.transform.position.clone(),
                n = new Laya.Vector3(0, 0, 0);
            this.Camera.viewport.project(s, this.Camera.projectionViewMatrix, n);
            let o = Laya.stage.height / 1334;
            this.TipsIcon.pos(n.x / Laya.stage.clientScaleX + 20, n.y / Laya.stage.clientScaleY - t * o - 10),
                this.TipsInitPosy = n.y / Laya.stage.clientScaleY - t * o - 10,
                Laya.stage.addChild(this.DowerBtn),
                a.IsIphoneX ? this.DowerBtn.centerY = 150 : this.DowerBtn.centerY = 90,
                this.DowerBtn.centerX = 0,
                this.OpenTipsIcon()
        }
        OpenTipsIcon() {
            let e = o.GetDataRandom({
                arry: this.TipsData,
                range: 1
            })[0];
            this.TipsLabel.text = e,
                Laya.Tween.to(this.TipsIcon, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut),
                Laya.timer.once(6e3, this, this.CloseTipsIcon)
        }
        CloseTipsIcon() {
            Laya.Tween.to(this.TipsIcon, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.timer.once(3e3, this, this.OpenTipsIcon)
        }
        PlayerActiveCtrl(e) {
            this.Player && (
                this.Player.active = e,
                this.DowerBtn.visible = e,
                e || (
                    //this.MiniGameBox.visible = e, 
                    this.RankTipsTP.visible = e,
                    this.SkinTipsTP.visible = e,
                    this.GiftTipsTP.visible = e,
                    this.ShopTipsTP.visible = e,
                    this.GameClubBtn && this.GameClubBtn.destroy()
                ),
                this.skeleton1 && (this.skeleton1.visible = !1)
            )
        }
        onEnable() {
            this.isOpenAward = false
        }
        StartGame() {
            n.PlaySound("click")
            if (this.isOpenAward) return;
            i.IsLoadTailsRes && i.IsLoadFloorRes && i.IsLoadPropRes ? (
                N._Instance.LoadMonsterRes(),
                i.Power > 0 ?
                platform.getInstance().showInterstitial(() => {
                    (
                        Laya.Tween.to(this.power, {
                                y: -30
                            }, 300, null,
                            Laya.Handler.create(this, () => {
                                this.power.visible = !1,
                                    N._Instance.UpdatePower(-1),
                                    i.MaxLevel < 10 ?
                                    1 == i.MaxLevel ||
                                    3 == i.MaxLevel ||
                                    4 == i.MaxLevel ||
                                    6 == i.MaxLevel ||
                                    7 == i.MaxLevel ||
                                    9 == i.MaxLevel ? (N._Instance.PlayerBuffType = 0, N._Instance.StartGame()) :
                                    2 == i.MaxLevel ||
                                    8 == i.MaxLevel ? Laya.View.open("Scene/BuffPanel.scene") :
                                    5 == i.MaxLevel && Laya.View.open("Scene/TrySkinPanel.scene") :
                                    10 == i.MaxLevel || i.MaxLevel % 10 == 0 && Math.random() > .5 ? (Laya.View.open("Scene/BuffPanel.scene")) :
                                    i.MaxLevel % 10 == 2 ||
                                    i.MaxLevel % 10 == 5 ||
                                    i.MaxLevel % 10 == 0 || i.IsShowBuff ? Laya.View.open("Scene/BuffPanel.scene") :
                                    (i.MaxLevel % 10 == 4 || i.MaxLevel % 10 == 6 || i.MaxLevel % 10 == 8) &&
                                    i.SkinData.length <= 25 ? Laya.View.open("Scene/TrySkinPanel.scene") :
                                    (N._Instance.PlayerBuffType = 0, N._Instance.StartGame())
                            }))
                    )
                }) :
                (
                    this.isOpenAward = true,
                    platform.getInstance().prompt("Lack of strength!", 500),
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false,
                                this.PlayerActiveCtrl(!1),
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetPower"])
                        }
                    }))) : X.OpenLoadTips("Resource loading...")
        }
        Set() {
            n.PlaySound("click"),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/SetPanel.scene", !1)
        }
        Rank() {
            n.PlaySound("click"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 2
                    }
                ]),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/RankPanel.scene", !1)
        }
        Sign() {
            n.PlaySound("click"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 3
                    }
                ]),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/SignPanel.scene", !1)
        }
        Lottery() {
            n.PlaySound("click"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 4
                    }
                ]),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/LotteryPanel.scene", !1)
        }
        Skin() {
            n.PlaySound("click"),
                i.IsOpenSkinPanel && i.IsLoadLvEffect ? (c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 5
                    }
                ]), this.PlayerActiveCtrl(!1), Laya.View.open("Scene/SkinPanel.scene", !1)) : X.OpenLoadTips("Resource loading...")
        }
        Shop() {
            c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 6
                    }
                ]),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/SkinShopPanel.scene", !1)
        }
        Arena() {
            n.PlaySound("click")
            if (this.isOpenAward) return;
            i.IsLoadTailsRes && i.IsLoadFloorRes && i.IsLoadPropRes ? (
                i.IsZJKFJJC ? i.Power >= 2 ?
                platform.getInstance().showInterstitial(() => {
                    (
                        console.log("show ad.."),
                        Laya.SoundManager.stopMusic(),
                        N._Instance.UpdatePower(-2),
                        Laya.View.open("Scene/ArenaMatePanel.scene")
                    )
                }) :
                (
                    platform.getInstance().prompt("Lack of strength!", 500),
                    this.isOpenAward = true,
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false,
                                this.PlayerActiveCtrl(!1),
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetPower"])
                        }
                    })) : i.Badge >= 1 && i.BadgeLv >= 2 || i.Badge >= 2 ? i.Power >= 2 ?
                platform.getInstance().showInterstitial(() => {
                    (N._Instance.ArenaLoadMonsterRes(),
                        Laya.SoundManager.stopMusic(),
                        N._Instance.UpdatePower(-2),
                        Laya.View.open("Scene/ArenaMatePanel.scene"))
                }) :
                (
                    platform.getInstance().prompt("Lack of strength!", 500),
                    this.isOpenAward = true,
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false,
                                this.PlayerActiveCtrl(!1),
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetPower"])
                        }
                    })
                ) : (
                    platform.getInstance().prompt("Bronze II unlock!"))) : X.OpenLoadTips("Resource loading...")
        }
        Gift() {
            n.PlaySound("click"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 7
                    }
                ]),
                (new Date).getTime() / 1e3 >= i.GiftEightTimeStamp ? (
                    this.PlayerActiveCtrl(!1),
                    this.IsGiftTween = !1,
                    Laya.Tween.clearAll(this.GiftTP),
                    this.GiftTP.rotation = 0,
                    Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Gift", this.GiftData[i.GiftIndex]]),
                    i.GiftIndex++,
                    i.GiftIndex > 20 && (i.GiftIndex = 0),
                    r.save_int("GiftIndex", i.GiftIndex),
                    i.GiftEightTimeStamp = (new Date).getTime() / 1e3 + 28800,
                    r.save_int("GiftEightTimeStamp", i.GiftEightTimeStamp),
                    this.GiftRefresh()
                ) :
                platform.getInstance().prompt("Let's play a game first. The gift is still on the way")
        }
        Dower() {
            n.PlaySound("click"),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/DowerPanel.scene", !1)
        }
        MoreGame() {
            n.PlaySound("click"),
                this.PlayerActiveCtrl(!1),
                Laya.View.open("Scene/SettleExportPanel.scene", !1, [0, 0, 2])
        }
        PowerRefresh() {
            if (i.Power < i.MaxPower) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    this.PowerTimeLabel.visible = !0,
                    this.IsConutTimer = !0,
                    Laya.timer.loop(1e3, this, this.CountDown)
            } else this.PowerTimeLabel.visible = !1
        }
        CountDown() {
            if (this.IsConutTimer) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    e <= 0 && (this.IsConutTimer = !1, Laya.timer.clear(this, this.CountDown), i.PowerTimeStamp = 0, r.save_int("PowerTimeStamp", i.PowerTimeStamp), N._Instance.UpdatePower(1), this.PowerRefresh())
            }
        }
        GiftRefresh() {
            if ((new Date).getTime() / 1e3 >= i.GiftEightTimeStamp) this.GiftLabel.text = "Available",
                this.IsGiftConutTimer = !1,
                this.IsGiftTween = !0,
                Laya.stage.addChild(this.GiftTipsTP),
                this.GiftTipsTPTween();
            else {
                this.IsGiftConutTimer = !0;
                let e = Math.round(i.GiftEightTimeStamp - parseInt(((new Date).getTime() / 1e3).toString())),
                    t = Math.floor(e % 3600);
                this.GiftLabel.text = o.Addo(parseInt((e / 3600).toString())) + ":" + o.Addo(parseInt((t / 60).toString())) + ":" + o.Addo(e % 60),
                    Laya.timer.loop(1e3, this, this.GiftCountDown)
            }
        }
        GiftCountDown() {
            if (this.IsGiftConutTimer) {
                let e = Math.round(i.GiftEightTimeStamp - parseInt(((new Date).getTime() / 1e3).toString())),
                    t = Math.floor(e % 3600);
                this.GiftLabel.text = o.Addo(parseInt((e / 3600).toString())) + ":" + o.Addo(parseInt((t / 60).toString())) + ":" + o.Addo(e % 60),
                    e <= 0 && (this.IsGiftTween = !0, this.GiftLabel.text = "Available", this.IsGiftConutTimer = !1)
            }
        }
        MiniGame(e = !0) {
            n.PlaySound("click"),
                this.IsOpen ? Laya.Tween.to(this.MiniGameBox, {
                        left: 0
                    },
                    400, null, Laya.Handler.create(this, () => {
                        this.BackBtn.visible = !1,
                            this.IsOpen = !1,
                            this.ZKTP.skewY = 180,
                            this.MiniGameList.visible = !1
                    })) : (this.MiniGameList.visible = !0, e && c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 13
                    }
                ]), 1 == i.ExportSwitch && 1 == i.StartSwitch && this.MiniGameSet(), Laya.Tween.to(this.MiniGameBox, {
                        left: 600
                    },
                    400, null, Laya.Handler.create(this, () => {
                        this.BackBtn.visible = !0,
                            this.IsOpen = !0,
                            this.ZKTP.skewY = 0
                    })))
        }
        Back() {
            n.PlaySound("click"),
                Laya.Tween.to(this.MiniGameBox, {
                        left: 0
                    },
                    400, null, Laya.Handler.create(this, () => {
                        this.BackBtn.visible = !1,
                            this.IsOpen = !1,
                            this.ZKTP.skewY = 180
                    }))
        }
        MiniGameSet() {
            this.MiniGameList.itemRender = F;
            let e = [];
            for (let t = 0; t < i.MiniGameData.length; t++) e.push(t);
            let t = o.GetDataRandom({
                arry: e,
                range: 6
            });
            this.MiniGameData = i.MiniGameData;
            for (let e = 0; e < this.MiniGameData.length; e++) {
                this.MiniGameData[e].ishd = !1;
                for (let a = 0; a < t.length; a++) e == t[a] && (this.MiniGameData[e].ishd = !0)
            }
            this.MiniGameList.array = this.MiniGameData,
                this.MiniGameList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.MiniGameData[t])
        }
        AlterApp() {
            let e = o.GetDataRandom({
                arry: i.SusGameData,
                range: 1
            })[0];
            e.location_index == this.CurrSusBannerIndex ? this.AlterApp() : (this.CurrSusBannerIndex = e.location_index, this.SusBannerIcon.skin = e.pathName, this.SusBannerBtn.on(Laya.Event.CLICK, this, this.SkipApp, [e]))
        }
        SkipApp(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index, 1)
        }
        Update() {
            if (this.MyIcon.skin = i.Head, this.GoldLabel.text = i.Gold.toString(), this.DiamondLabel.text = i.Diamond.toString(), this.PowerLabel.text = i.Power + "/" + i.MaxPower, this.BadgeLabel.text = i.BadgeData[i.Badge - 1] + i.BadgeLvData[i.BadgeLv - 1], this.ExpLabel.text = i.Exp + "/" + i.MaxExp, this.ExpJDT.width = i.Exp / i.MaxExp * 290, this.Player) {
                let e = -150 * (this.Player.transform.scale.y - 1) + this.TipsInitPosy;
                this.TipsIcon.pos(this.TipsIcon.x, e)
            }
            this.IsConutTimer || this.PowerTimeLabel.visible || this.PowerRefresh(),
                0 == i.IsSign ? this.SignHD.visible = !0 : this.SignHD.visible = !1,
                i.IsNewSkin ? (this.SkinHD.visible = !0, this.IsSkinHDTween = !0) : this.SkinHD.visible = !1
        }
        Refresh() {
            this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + i.Badge + ".png";
            let e = 1;
            e = i.MaxLevel % 10 == 0 ? 10 : i.MaxLevel % 10,
                this.MyBox.x = 51 + 72 * (e - 1),
                this.LevelJDT.width = this.MyBox.x,
                this.MyLevelTP.visible = !0,
                this.MyLevelLabel.text = i.MaxLevel.toString();
            let t = 10 * Math.floor((i.MaxLevel - 1) / 10) + 7;
            this.SevenLevelLabel.text = t.toString(),
                this.SevenTP.visible = e >= 7,
                e > 7 ? this.SevenBox.visible = !1 : i.MaxLevel >= 10 ? this.SevenBox.visible = !0 : this.SevenBox.visible = !1;
            let a = 10 * Math.floor((i.MaxLevel - 1) / 10) + 10;
            this.TenLevelLabel.text = a.toString(),
                this.TenTP.visible = e >= 10,
                this.isOpenAward = false,
                r.save_int("IsOpenSign", 1),
                1 != i.IsOpenSign || 0 != i.IsSign || i.IsOpenQD || (i.IsOpenQD = !0, c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 3
                    }
                ]), this.PlayerActiveCtrl(!1), Laya.View.open("Scene/SignPanel.scene", !1))
        }
        StartGameBtnTween() {
            Laya.Tween.to(this.ksyxtp, {
                    scaleX: 1.1,
                    scaleY: 1.1
                },
                1e3, null, Laya.Handler.create(this, this.StartGameBtnTween1))
        }
        StartGameBtnTween1() {
            Laya.Tween.to(this.ksyxtp, {
                    scaleX: 1,
                    scaleY: 1
                },
                1e3, null, Laya.Handler.create(this, this.StartGameBtnTween))
        }
        JbTPTween() {
            Laya.Tween.to(this.jbtp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.JbTPTween1))
        }
        JbTPTween1() {
            Laya.Tween.to(this.jbtp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.JbTPTween2))
        }
        JbTPTween2() {
            Laya.Tween.to(this.jbtp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.JbTPTween3))
        }
        JbTPTween3() {
            Laya.Tween.to(this.jbtp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        BossTPTween() {
            Laya.Tween.to(this.bosstp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.BossTPTween1))
        }
        BossTPTween1() {
            Laya.Tween.to(this.bosstp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.BossTPTween2))
        }
        BossTPTween2() {
            Laya.Tween.to(this.bosstp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.BossTPTween3))
        }
        BossTPTween3() {
            Laya.Tween.to(this.bosstp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        JbTP1Tween() {
            Laya.Tween.to(this.jbtp1, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.JbTP1Tween1))
        }
        JbTP1Tween1() {
            Laya.Tween.to(this.jbtp1, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.JbTP1Tween2))
        }
        JbTP1Tween2() {
            Laya.Tween.to(this.jbtp1, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.JbTP1Tween3))
        }
        JbTP1Tween3() {
            Laya.Tween.to(this.jbtp1, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        BossTP1Tween() {
            Laya.Tween.to(this.bosstp1, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.BossTP1Tween1))
        }
        BossTP1Tween1() {
            Laya.Tween.to(this.bosstp1, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.BossTP1Tween2))
        }
        BossTP1Tween2() {
            Laya.Tween.to(this.bosstp1, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.BossTP1Tween3))
        }
        BossTP1Tween3() {
            Laya.Tween.to(this.bosstp1, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        MFTPTween() {
            Laya.Tween.to(this.mftp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.MFTPTween1))
        }
        MFTPTween1() {
            Laya.Tween.to(this.mftp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.MFTPTween2))
        }
        MFTPTween2() {
            Laya.Tween.to(this.mftp, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.MFTPTween3))
        }
        MFTPTween3() {
            Laya.Tween.to(this.mftp, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        GiftTween() {
            Laya.Tween.to(this.GiftTP, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.GiftTween1))
        }
        GiftTween1() {
            Laya.Tween.to(this.GiftTP, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.GiftTween2))
        }
        GiftTween2() {
            Laya.Tween.to(this.GiftTP, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.GiftTween3))
        }
        GiftTween3() {
            Laya.Tween.to(this.GiftTP, {
                    rotation: 0
                },
                50, null)
        }
        SkinHDTween() {
            Laya.Tween.to(this.SkinHD, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.SkinHDTween1))
        }
        SkinHDTween1() {
            Laya.Tween.to(this.SkinHD, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.SkinHDTween2))
        }
        SkinHDTween2() {
            Laya.Tween.to(this.SkinHD, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.SkinHDTween3))
        }
        SkinHDTween3() {
            Laya.Tween.to(this.SkinHD, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        DinWeiTween() {
            Laya.Tween.clearAll(this.DinWeiTP),
                Laya.Tween.to(this.DinWeiTP, {
                        y: -55
                    },
                    500, null, Laya.Handler.create(this, this.DinWeiTween1))
        }
        DinWeiTween1() {
            Laya.Tween.to(this.DinWeiTP, {
                    y: -50
                },
                500, null, Laya.Handler.create(this, this.DinWeiTween2))
        }
        DinWeiTween2() {
            Laya.Tween.to(this.DinWeiTP, {
                    y: -55
                },
                500, null, Laya.Handler.create(this, this.DinWeiTween3))
        }
        DinWeiTween3() {
            Laya.Tween.to(this.DinWeiTP, {
                    y: -50
                },
                500, null)
        }
        GiftTipsTPTween() {
            Laya.timer.once(3e3, this, () => {
                    this.GiftTipsTP && this.GiftTipsTP.visible && this.GiftTipsCloseTween()
                }),
                a.IsIphoneX ? this.GiftTipsTP.bottom = 700 : this.GiftTipsTP.bottom = 670,
                this.GiftTipsTP.x = 165,
                this.GiftTipsTP.scale(0, 0),
                this.GiftTipsTP.visible = !0,
                Laya.Tween.to(this.GiftTipsTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, this.GiftTipsTPTween1))
        }
        GiftTipsTPTween1() {
            Laya.Tween.to(this.GiftTipsTP, {
                    x: 180
                },
                1e3, null, Laya.Handler.create(this, this.GiftTipsTPTween2))
        }
        GiftTipsTPTween2() {
            Laya.Tween.to(this.GiftTipsTP, {
                    x: 165
                },
                1e3, null, Laya.Handler.create(this, this.GiftTipsTPTween1))
        }
        GiftTipsCloseTween() {
            Laya.Tween.to(this.GiftTipsTP, {
                    scaleX: 0,
                    scaleY: 0
                },
                500, Laya.Ease.backIn)
        }
        RankTipsTPTween() {
            Laya.timer.once(3e3, this, () => {
                    this.RankTipsTP && this.RankTipsTP.visible && this.RankTipsTPCloseTween()
                }),
                a.IsIphoneX ? this.RankTipsTP.centerY = -340 : this.RankTipsTP.centerY = -280,
                this.RankTipsTP.x = 640,
                this.RankTipsTP.scale(0, 0),
                this.RankTipsTP.visible = !0,
                Laya.Tween.to(this.RankTipsTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, this.RankTipsTPTween1))
        }
        RankTipsTPTween1() {
            Laya.Tween.to(this.RankTipsTP, {
                    x: 625
                },
                1e3, null, Laya.Handler.create(this, this.RankTipsTPTween2))
        }
        RankTipsTPTween2() {
            Laya.Tween.to(this.RankTipsTP, {
                    x: 640
                },
                1e3, null, Laya.Handler.create(this, this.RankTipsTPTween1))
        }
        RankTipsTPCloseTween() {
            Laya.Tween.to(this.RankTipsTP, {
                    scaleX: 0,
                    scaleY: 0
                },
                500, Laya.Ease.backIn)
        }
        SkinTipsTPTween() {
            Laya.timer.once(3e3, this, () => {
                    this.SkinTipsTP && this.SkinTipsTP.visible && this.SkinTipsTPCloseTween()
                }),
                a.IsIphoneX ? this.SkinTipsTP.centerY = 20 : this.SkinTipsTP.centerY = 80,
                this.SkinTipsTP.x = 640,
                this.SkinTipsTP.scale(0, 0),
                this.SkinTipsTP.visible = !0,
                Laya.Tween.to(this.SkinTipsTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, this.SkinTipsTPTween1))
        }
        SkinTipsTPTween1() {
            Laya.Tween.to(this.SkinTipsTP, {
                    x: 625
                },
                1e3, null, Laya.Handler.create(this, this.SkinTipsTPTween2))
        }
        SkinTipsTPTween2() {
            Laya.Tween.to(this.SkinTipsTP, {
                    x: 640
                },
                1e3, null, Laya.Handler.create(this, this.SkinTipsTPTween1))
        }
        SkinTipsTPCloseTween() {
            Laya.Tween.to(this.SkinTipsTP, {
                    scaleX: 0,
                    scaleY: 0
                },
                500, Laya.Ease.backIn)
        }
        ShopTipsTPTween() {
            Laya.timer.once(3e3, this, () => {
                    this.ShopTipsTP && this.ShopTipsTP.visible && this.ShopTipsTPCloseTween()
                }),
                a.IsIphoneX ? this.ShopTipsTP.bottom = 360 : this.ShopTipsTP.bottom = 300,
                this.ShopTipsTP.x = 145,
                this.ShopTipsTP.scale(0, 0),
                this.ShopTipsTP.visible = !0,
                Laya.Tween.to(this.ShopTipsTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut, Laya.Handler.create(this, this.ShopTipsTPTween1))
        }
        ShopTipsTPTween1() {
            Laya.Tween.to(this.ShopTipsTP, {
                    x: 160
                },
                1e3, null, Laya.Handler.create(this, this.ShopTipsTPTween2))
        }
        ShopTipsTPTween2() {
            Laya.Tween.to(this.ShopTipsTP, {
                    x: 145
                },
                1e3, null, Laya.Handler.create(this, this.ShopTipsTPTween1))
        }
        ShopTipsTPCloseTween() {
            Laya.Tween.to(this.ShopTipsTP, {
                    scaleX: 0,
                    scaleY: 0
                },
                500, Laya.Ease.backIn)
        }
        SusTween1() {
            Laya.Tween.to(this.SusBannerBtn, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.SusTween2))
        }
        SusTween2() {
            Laya.Tween.to(this.SusBannerBtn, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.SusTween3))
        }
        SusTween3() {
            Laya.Tween.to(this.SusBannerBtn, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.SusTween4))
        }
        SusTween4() {
            Laya.Tween.to(this.SusBannerBtn, {
                    rotation: 0
                },
                50, null, Laya.Handler.create(this, this.AlterApp))
        }
        MoreGameTween() {
            Laya.Tween.to(this.MoreGameBtn, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.MoreGameTween1))
        }
        MoreGameTween1() {
            Laya.Tween.to(this.MoreGameBtn, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.MoreGameTween2))
        }
        MoreGameTween2() {
            Laya.Tween.to(this.MoreGameBtn, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.MoreGameTween3))
        }
        MoreGameTween3() {
            Laya.Tween.to(this.MoreGameBtn, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.IsShowStartInterstitialAd = !1,
                this.MiniGameBox && this.MiniGameBox.removeSelf(),
                this.RankTipsTP && this.RankTipsTP.removeSelf(),
                this.SkinTipsTP && this.SkinTipsTP.removeSelf(),
                this.GiftTipsTP && this.GiftTipsTP.removeSelf(),
                this.ShopTipsTP && this.ShopTipsTP.removeSelf(),
                this.DowerBtn && this.DowerBtn.removeSelf(),
                this.Scene3D && this.Scene3D.destroy(),
                L.BannerShowData[0] = !1,
                L.StartBanner && L.StartBanner.hide(),
                this.GameClubBtn && this.GameClubBtn.destroy()
        }
    }
    class F extends e.Scene.MiniGameItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (Laya.timer.clearAll(this), Laya.Tween.clearAll(this), this.rotation = 0, this.MiniGameIcon.skin = e.pathName, this.MiniGameLabel.text = e.name, e.ishd ? (this.HDTP.visible = !0, Laya.timer.loop(2e3, this, this.MiniTween)) : this.HDTP.visible = !1, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            console.log(e),
                n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index, 1)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                Laya.Tween.clearAll(this),
                this.rotation = 0
        }
        MiniTween() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.MiniTween1))
        }
        MiniTween1() {
            Laya.Tween.to(this, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.MiniTween2))
        }
        MiniTween2() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.MiniTween3))
        }
        MiniTween3() {
            Laya.Tween.to(this, {
                    rotation: 0
                },
                50, null)
        }
    }
    class X {
        static GetPhoneMsg() {
            if (window.wx) {
                if (a.PhoneMsg = window.wx.getSystemInfoSync(),
                    console.log(a.PhoneMsg),
                    Laya.Browser.onIOS && Laya.Browser.onIPad && Laya.Browser.onIPhone && a.PhoneMsg && a.PhoneMsg.model) {
                    let e = a.PhoneMsg.model.replace(/\s*/g, "");
                    console.log(e);
                    let t = e[6],
                        s = o.isNumber(t);
                    s && 1 == t ? e[7] && o.isNumber(e[7]) ? i.BenchmarkLevel = 3 : i.BenchmarkLevel = 1 : s && t <= 7 ? i.BenchmarkLevel = 1 : s && t <= 8 ? i.BenchmarkLevel = 2 : s || (i.BenchmarkLevel = 3)
                } else 0 == a.PhoneMsg.benchmarkLevel ||
                    -2 == a.PhoneMsg.benchmarkLevel ||
                    a.PhoneMsg.benchmarkLevel >= 1 &&
                    a.PhoneMsg.benchmarkLevel <= 20 ?
                    i.BenchmarkLevel = 1 :
                    a.PhoneMsg.benchmarkLevel >= 11 &&
                    a.PhoneMsg.benchmarkLevel <= 35 ?
                    i.BenchmarkLevel = 2 :
                    i.BenchmarkLevel = 3;
                //console.log("性能分级为：", i.BenchmarkLevel)
            }
            a.PhoneMsg && a.PhoneMsg.model && a.PhoneMsg.model.startsWith("iPhone X") && (a.IsIphoneX = !0),
                Laya.Browser.onIOS && Laya.Browser.onIPad && Laya.Browser.onIPhone && (a.IsIphone = !0)
        }
        static LoginInit() {
            window.wx && window.wx.login({
                success: function(e) {
                    a.LoginCode = e.code;
                    //console.log("获取code成功！", e);
                    let t = new Laya.HttpRequest;
                    t.http.timeout = 1e4,
                        t.once(Laya.Event.COMPLETE, this, e => {
                            e && (
                                //console.log("获取服务器数据是：", e), 
                                i.UId = e.data.uid, c.UId = e.data.uid, r.save_int("UId", e.data.uid), i.OpenId = e.data.open_id, i.IsNet = !0, h.SendMsgToServer("get_user_base_info"), d.SendMsgToServer("export_game", [1]), d.SendMsgToServer("export_game", [2]), d.SendMsgToServer("export_game", [6]))
                        }),
                        t.once(Laya.Event.ERROR, this, e => {
                            // console.log("请求失败：", e),
                            // 0 == i.UId || 0 == c.UId ? t.send("https://test.52zthy.cn/trdApi/snakeLogin.aspx?code=" + a.LoginCode + "&channel=" + a.channel, null, "post", "json") : (i.IsNet = !0, h.SendMsgToServer("get_user_base_info"), d.SendMsgToServer("export_game", [1]), d.SendMsgToServer("export_game", [2]), d.SendMsgToServer("export_game", [6]))
                        })
                    // t.send("https://test.52zthy.cn/trdApi/snakeLogin.aspx?code=" + a.LoginCode + "&channel=" + a.channel, null, "post", "json"),
                    // console.log("我请求服务器的链接是：", "https://test.52zthy.cn/trdApi/snakeLogin.aspx?code=" + a.LoginCode + "&channel=" + a.channel)
                },
                fail: function(e) {
                    //console.log("微信code码获取失败！"),
                    0 == i.UId || 0 == c.UId ? X.LoginInit() : (i.IsNet = !0, h.SendMsgToServer("get_user_base_info"), d.SendMsgToServer("export_game", [1]), d.SendMsgToServer("export_game", [2]), d.SendMsgToServer("export_game", [6]))
                }
            })
        }
        static GetInitMsg() {
            if (window.wx) {
                var e = window.wx.getLaunchOptionsSync();
                console.log("getLaunchOptionsSync:", e),
                    a.SceneId = e.scene,
                    a.Query = e.query,
                    a.ReferrerInfo = e.referrerInfo,
                    e && e.query && e.query.channel && (a.channel = e.query.channel),
                    X.LoginInit()
            }
        }
        static UserAuthor() {
            window.wx && window.wx.getSetting({
                success: function(e) {
                    !0 === e.authSetting["scope.userInfo"] ? i.IsAuthor = !0 : X.CreateAuthorBtn()
                }
            })
        }
        static CreateAuthorBtn() {
            if (window.wx) {
                const e = window.wx.createUserInfoButton({
                    type: "text",
                    text: "",
                    style: {
                        left: 0,
                        top: 0,
                        width: Laya.stage.width,
                        height: Laya.stage.height,
                        lineHeight: 40
                    }
                });
                e.onTap(t => {
                    "getUserInfo:ok" === t.errMsg ? (i.IsAuthor = !0, this.GetIvMsg(), e.hide()) : e.hide()
                })
            }
        }
        static GetIvMsg() {
            window.wx && window.wx.getUserInfo({
                withCredentials: !0,
                lang: "zh_CN",
                success: function(e) {
                    "getUserInfo:ok" === e.errMsg && (a.EncryptedData = e.encryptedData, a.Iv = e.iv, window.wx && window.wx.getUserInfo({
                        success: function(e) {
                            console.log(e),
                                i.Name = e.userInfo.nickName,
                                i.Head = e.userInfo.avatarUrl,
                                r.save_string("Name", i.Name),
                                r.save_string("Head", i.Head)
                        }
                    }))
                },
                fail: function(e) {
                    //console.log("获取IV数据失败！")
                }
            })
        }
        static ShareApp(e, t, a) {
            this.ShareAppMsg(e),
                a && (this.onShow(a, t), this.onHide(t))
        }
        static ShareAppMsg(e) {
            if (window.wx) {
                let t = o.GetDataRandom({
                    arry: e,
                    range: 1
                })[0];
                window.wx.shareAppMessage({
                    title: i.ShareList[t].title,
                    imageUrl: i.ShareList[t].imageUrl,
                    imageUrlId: i.ShareList[t].imageUrlId
                })
            }
        }
        static onShow(e, t) {
            window.wx && window.wx.onShow(function(a) {
                switch (t) {
                    case "Revive":
                        i.IsCountDown = !0
                        //n.PlayBGM();
                        break;
                    case "Skin":
                        //n.PlayBGM1();
                        break;
                    case "ArenaRevive":
                        i.IsCountDown = !0
                        //n.PlayBGM()
                }
                X.ShowTime = (new Date).getTime();
                let s = 3e3,
                    r = 2;
                "MFSkin" == t && (r = 3, s = 0 == X.ShareNum ? 5e3 : 3e3),
                    X.ShowTime - X.HideTime < s ? (X.ShareNum++, X.ShareNum >= r ? (X.ShareNum = 0, e && e.run()) : (platform.getInstance().prompt(o.GetDataRandom({
                            arry: X.ShareMsgData,
                            range: 1
                        })[0]), "MFSkin" == t, // && n.PlayBGM1(), 
                        "ArenaRevive" == t && (i.IsCountDown = !0))) : (X.ShareNum = 0, e && e.run()),
                    window.wx.offShow()
            })
        }
        static onHide(e) {
            window.wx && window.wx.onHide(function(t) {
                switch (e) {
                    case "Revive":
                        i.IsCountDown = !1,
                            Laya.SoundManager.stopMusic();
                        break;
                    case "Skin":
                        n.StopBGM1();
                        break;
                    case "ArenaRevive":
                        i.IsCountDown = !1,
                            Laya.SoundManager.stopMusic()
                }
                X.HideTime = (new Date).getTime(),
                    window.wx.offHide()
            })
        }
        static SkipMiniGame(e, t, a, s, n = 0) {
            window.wx && window.wx.navigateToMiniProgram({
                appId: e,
                path: t,
                success: function(e) {
                    //console.log("跳转成功!"),
                    d.SendMsgToServer("game_event", [a, s, 2])
                },
                fail: function(e) {
                    //console.log("取消跳转!"),
                    1 == i.ExportSwitch && i.SettleExportGameData.length > 0 && (0 == n ? Laya.View.open("Scene/SettleExportPanel.scene", !1, [0, 0, 3]) : 1 == n && (z && z._Instance && z._Instance.PlayerActiveCtrl(!1), Laya.View.open("Scene/SettleExportPanel.scene", !1, [0, 0, 4])))
                }
            })
        }
        static GetFriendRank(e, t) {
            if (window.wx) {
                let a = {
                    type: e,
                    openid: i.OpenId,
                    robotsdata: t
                };
                window.wx.getOpenDataContext().postMessage(a)
            }
        }
        static GetFriendRankMsg() {
            window.wx && window.wx.setUserCloudStorage({
                KVDataList: [{
                    key: "MaxLevel",
                    value: i.MaxLevel.toString()
                }],
                success: function(e) {
                    console.log(e)
                },
                fail: function(e) {
                    console.log(e)
                }
            })
        }
        static OpenShareMenu() {
            if (window.wx && window.wx.showShareMenu({
                    withShareTicket: !0
                }), window.wx) {
                var e = o.GetDataRandom({
                    arry: [0, 1, 2, 3, 4],
                    range: 1
                })[0];
                window.wx.onShareAppMessage(() => ({
                    title: i.ShareList[e].title,
                    imageUrl: i.ShareList[e].imageUrl,
                    imageUrlId: i.ShareList[e].imageUrlId
                }))
            }
        }
        static OpenService() {
            window.wx && window.wx.openCustomerServiceConversation({
                success: function(e) {
                    console.log(e)
                },
                fail: function(e) {
                    console.log(e)
                }
            })
        }
        static CreateGameClubBtn() {
            if (window.wx) {
                let e = 60;
                return Laya.stage.height / Laya.stage.width > 2.1 && (e += 30),
                    window.wx.createGameClubButton({
                        icon: "dark",
                        style: {
                            left: a.PhoneMsg.screenWidth - 50,
                            top: e,
                            width: 45,
                            height: 45
                        }
                    })
            }
        }
        static OpenTips(e, t = 3e3) {
            window.wx && window.wx.showToast({
                title: e,
                icon: "none",
                duration: t
            })
        }
        static OpenLoadTips(e, t = 2e3) {
            window.wx && window.wx.showToast({
                title: e,
                icon: "loading",
                duration: t
            })
        }
    }
    X.ShareMsgData = ["分享失败，换个好友试试！", "好友网络故障，换个群试试！"],
        X.ShareNum = 0,
        X.ShowTime = 0,
        X.HideTime = 0;
    class Y extends e.Scene.ArenaAwardPanelUI {
        constructor() {
            super(),
                this.IsSettle = !0,
                this.AwardData = [],
                this.AwardLength = 0,
                this.CurrSusBannerIndex = 99,
                this.CurrSusBannerIndex1 = 100,
                this.PosXData = [
                    [375],
                    [176, 375, 574],
                    [123, 292, 461, 630]
                ],
                this.MiniUpData = [],
                this.MiniDownData = [],
                this.scroll = 0,
                this.scroll1 = 0,
                this.IsMove = 60,
                this.IsMove1 = 60
        }
        onAwake() {
            s.MatchScreen(this),
                s.AddBtnAnimation([this.GetAwardBtn, this.SusBannerBtn1, this.SusBannerBtn2]);
            let e = Laya.stage.height / 1334,
                t = Laya.stage.width / 750;
            e >= t ? this.Bg.scale(e, e) : this.Bg.scale(t, t),
                this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAward),
                s.SetBtnBottom(this.GetAwardBtn, 280),
                s.SetBtnBottom(this.SusBannerBtn1, 280),
                s.SetBtnBottom(this.SusBannerBtn2, 280),
                L.BannerShowData[21] = !0,
                L.CreateBannerAd("adunit-7e00d14681ff1741"),
                i.IsArenaAwardCallBack ? this.MiniUpCallBack() : d.SendMsgToServer("export_game", [11], Laya.Handler.create(this, this.MiniUpCallBack))
        }
        MiniUpCallBack() {
            i.IsArenaAwardCallBack = !0,
                1 == i.ExportSwitch && 1 == i.SettleSwitch && i.ArenaAwardGameData.length > 0 ? (this.ExportUpTP.visible = !0, this.ExportDownTP.visible = !0, this.SusBannerBtn1.visible = !0, this.SusBannerBtn2.visible = !0, this.MiniSet(), this.MiniSet1(), this.AlterApp(), this.AlterApp1(), Laya.timer.loop(3e3, this, () => {
                    this.SusTween1(),
                        this.SusTween5()
                })) : (this.ExportUpTP.visible = !1, this.ExportDownTP.visible = !1, this.SusBannerBtn1.visible = !1, this.SusBannerBtn2.visible = !1)
        }
        AlterApp() {
            let e = o.GetDataRandom({
                arry: i.ArenaAwardGameData,
                range: 1
            })[0];
            e.location_index == this.CurrSusBannerIndex || e.location_index == this.CurrSusBannerIndex1 ? this.AlterApp() : (this.CurrSusBannerIndex = e.location_index, this.SusBannerTP1.skin = e.pathName, this.SusBannerBtn1.on(Laya.Event.CLICK, this, this.SkipApp, [e]))
        }
        AlterApp1() {
            let e = o.GetDataRandom({
                arry: i.ArenaAwardGameData,
                range: 1
            })[0];
            e.location_index == this.CurrSusBannerIndex || e.location_index == this.CurrSusBannerIndex1 ? this.AlterApp1() : (this.CurrSusBannerIndex1 = e.location_index, this.SusBannerTP2.skin = e.pathName, this.SusBannerBtn2.on(Laya.Event.CLICK, this, this.SkipApp, [e]))
        }
        SkipApp(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
        SusTween1() {
            Laya.Tween.to(this.SusBannerBtn1, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.SusTween2))
        }
        SusTween2() {
            Laya.Tween.to(this.SusBannerBtn1, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.SusTween3))
        }
        SusTween3() {
            Laya.Tween.to(this.SusBannerBtn1, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.SusTween4))
        }
        SusTween4() {
            Laya.Tween.to(this.SusBannerBtn1, {
                    rotation: 0
                },
                50, null, Laya.Handler.create(this, this.AlterApp))
        }
        SusTween5() {
            Laya.Tween.to(this.SusBannerBtn2, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.SusTween6))
        }
        SusTween6() {
            Laya.Tween.to(this.SusBannerBtn2, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.SusTween7))
        }
        SusTween7() {
            Laya.Tween.to(this.SusBannerBtn2, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.SusTween8))
        }
        SusTween8() {
            Laya.Tween.to(this.SusBannerBtn2, {
                    rotation: 0
                },
                50, null, Laya.Handler.create(this, this.AlterApp1))
        }
        onOpened(e) {
            if (e) {
                this.AwardData = e[0];
                let t = 0;
                for (let e = 0; e < this.AwardData.length; e++) 0 != this.AwardData[e][1] && t++;
                this.AwardLength = t,
                    this.IsSettle = !0;
                let a = 0;
                for (let e = 0; e < this.AwardData.length; e++) {
                    let s = this.AwardData[e],
                        n = this.AwardBox.getChildAt(e + 2);
                    if (n.scale(0, 0), 1 == s[0] && 0 != s[1]) {
                        switch (a++, n.visible = !0, n.getChildAt(0).visible = !0, n.getChildAt(4).text = "x" + s[1], t) {
                            case 1:
                                n.pos(375, 245);
                                break;
                            case 3:
                                n.pos(176, 245);
                                break;
                            case 4:
                                n.pos(123, 245)
                        }
                        Laya.Tween.to(n, {
                                scaleX: 1,
                                scaleY: 1
                            },
                            300, Laya.Ease.backOut, null, 250 * e)
                    } else if (2 == s[0] && 0 != s[1]) {
                        switch (a++, n.visible = !0, n.getChildAt(1).visible = !0, n.getChildAt(4).text = "x" + s[1], t) {
                            case 3:
                                n.pos(375, 245);
                                break;
                            case 4:
                                n.pos(292, 245)
                        }
                        Laya.Tween.to(n, {
                                scaleX: 1,
                                scaleY: 1
                            },
                            300, Laya.Ease.backOut, null, 250 * e)
                    } else if (3 == s[0] && 0 != s[1]) {
                        switch (a++, n.visible = !0, n.getChildAt(2).visible = !0, n.getChildAt(4).text = "x" + s[1], t) {
                            case 3:
                                n.pos(574, 245);
                                break;
                            case 4:
                                n.pos(461, 245)
                        }
                        Laya.Tween.to(n, {
                                scaleX: 1,
                                scaleY: 1
                            },
                            300, Laya.Ease.backOut, null, 250 * e)
                    } else if (4 == s[0] && 0 != s[1]) {
                        switch (a++, n.visible = !0, n.getChildAt(3).skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png", n.getChildAt(3).visible = !0, n.getChildAt(4).text = " piecex1", t) {
                            case 4:
                                n.pos(630, 245)
                        }
                        Laya.Tween.to(n, {
                                scaleX: 1,
                                scaleY: 1
                            },
                            300, Laya.Ease.backOut, null, 250 * e)
                    }
                }
                Laya.timer.once(250 * (a - 1) + 300, this, () => {
                    this.IsSettle = !1
                })
            }
        }
        onEnable() {}
        GetAward() {
            n.PlaySound("click"),
                this.IsSettle ?
                platform.getInstance().prompt("Counting your result...") :
                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["ArenaAward", this.AwardData, this.AwardLength])
        }
        onDisable() {
            L.BannerShowData[21] = !1,
                L.ArenaAwardBanner && L.ArenaAwardBanner.hide()
        }
        MiniSet() {
            this.ExportUpList.itemRender = K,
                this.ExportUpList.hScrollBarSkin = null,
                this.MiniUpData = i.ArenaAwardGameData,
                this.ExportUpList.array = this.MiniUpData,
                this.ExportUpList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.MiniUpScoll()
        }
        freshList1(e, t) {
            e.setShow(this.MiniUpData[t])
        }
        MiniSet1() {
            this.ExportDownList.itemRender = K,
                this.ExportDownList.hScrollBarSkin = null,
                this.MiniDownData = i.ArenaAwardGameData,
                this.ExportDownList.array = this.MiniDownData,
                this.ExportDownList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1),
                this.MiniDownScoll()
        }
        freshList2(e, t) {
            e.setShow(this.MiniDownData[t])
        }
        MiniUpScoll() {
            this.MiniUpData.length <= 5 || (Laya.timer.loop(30, this, this.MiniUpScollLoop), this.ExportUpList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove = 0
            }))
        }
        MiniDownScoll() {
            this.MiniDownData.length <= 5 || (Laya.timer.loop(30, this, this.MiniDownScollLoop), this.ExportDownList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove1 = 0
            }))
        }
        MiniUpScollLoop() {
            if (this.IsMove >= 60)
                if (0 == this.scroll) {
                    this.ExportUpList.scrollBar.value += 2;
                    var e = this.MiniUpData.length;
                    this.ExportUpList.scrollBar.value >= 69 * e && (this.ExportUpList.scrollBar.value = 69 * e, this.scroll = 69 * e)
                } else this.ExportUpList.scrollBar.value -= 2,
                    this.ExportUpList.scrollBar.value <= 0 && (this.ExportUpList.scrollBar.value = 0, this.scroll = 0);
            else this.IsMove++
        }
        MiniDownScollLoop() {
            if (this.IsMove1 >= 60)
                if (0 == this.scroll1) {
                    this.ExportDownList.scrollBar.value += 2;
                    var e = this.MiniDownData.length;
                    this.ExportDownList.scrollBar.value >= 69 * e && (this.ExportDownList.scrollBar.value = 69 * e, this.scroll1 = 69 * e)
                } else this.ExportDownList.scrollBar.value -= 2,
                    this.ExportDownList.scrollBar.value <= 0 && (this.ExportDownList.scrollBar.value = 0, this.scroll1 = 0);
            else this.IsMove1++
        }
    }
    class K extends e.Scene.ExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class j extends e.Scene.ArenaMatePanelUI {
        constructor() {
            super(),
                this.MyMateData = [],
                this.EnemyMateData = [],
                this.MateIndex = 0,
                this.IsConutTimer = !1
        }
        onAwake() {
            s.MatchScreen(this),
                s.TopUIMatch(this.TopBox, 0);
            let e = Laya.stage.height / 1334,
                t = Laya.stage.width / 750;
            e >= t ? this.Bg.scale(e, e) : this.Bg.scale(t, t),
                this.Refresh(),
                this.PowerRefresh(),
                Laya.timer.frameLoop(1, this, this.Update),
                Laya.Tween.to(this.JJCTP, {
                        y: -35
                    },
                    1e3, Laya.Ease.backOut),
                Laya.Tween.to(this.MyBg, {
                        x: 95
                    },
                    1e3, Laya.Ease.backOut),
                Laya.Tween.to(this.EnemyBg, {
                        x: 655
                    },
                    1e3, Laya.Ease.backOut),
                Laya.Tween.to(this.DJSTP, {
                        scaleX: .8,
                        scaleY: .8
                    },
                    1e3, Laya.Ease.backOut, Laya.Handler.create(this, this.StartGame)),
                L.BannerShowData[18] = !0,
                L.CreateBannerAd("adunit-42a7247d35ff1118"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 11
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ])
        }
        onEnable() {}
        StartGame() {
            N._Instance.LoadEffectRes(),
                this.MateLabel.visible = !0,
                this.TipsLabel.scale(0, 0),
                Laya.Tween.to(this.TipsLabel, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    300, Laya.Ease.backOut),
                Laya.timer.once(5e3, this, () => {
                    N._Instance.ArenaStartGame()
                })
        }
        Refresh() {
            this.MyMateData = [],
                this.EnemyMateData = [],
                N._Instance.EnemyrandonNameData = o.GetDataRandom({
                    arry: i.EnemyNameData,
                    range: 9
                }),
                N._Instance.EnemyrandomHeadData = o.GetNonredundantNum();
            for (let e = 0; e < 5; e++) {
                let t = {},
                    a = this.GetMyBadge();
                2 == e ? (t.isself = 1, t.head = i.Head, t.badge = i.Badge, t.badgelv = i.BadgeLv, t.name = i.Name) : 0 == e || 1 == e ? (t.isself = 0, t.head = N._Instance.EnemyrandomHeadData[e], t.badge = a[0], t.badgelv = a[1], t.name = N._Instance.EnemyrandonNameData[e]) : (t.isself = 0, t.head = N._Instance.EnemyrandomHeadData[e - 1], t.badge = a[0], t.badgelv = a[1], t.name = N._Instance.EnemyrandonNameData[e - 1]),
                    this.MyMateData.push(t)
            }
            for (let e = 4; e < 9; e++) {
                let t = {},
                    a = this.GetMyBadge();
                t.isself = 0,
                    t.head = N._Instance.EnemyrandomHeadData[e],
                    t.badge = a[0],
                    t.badgelv = a[1],
                    t.name = N._Instance.EnemyrandonNameData[e],
                    this.EnemyMateData.push(t)
            }
            this.MyMateSet(),
                this.EnemyMateSet()
        }
        MyMateSet() {
            this.MyMateList.itemRender = Z,
                this.MyMateList.array = this.MyMateData,
                this.MyMateList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.MyMateData[t])
        }
        EnemyMateSet() {
            this.EnemyMateList.itemRender = J,
                this.EnemyMateList.array = this.EnemyMateData,
                this.EnemyMateList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1)
        }
        freshList2(e, t) {
            e.setShow(this.EnemyMateData[t])
        }
        Update() {
            this.ZZTP.rotation += 3,
                this.GoldLabel.text = i.Gold.toString(),
                this.DiamondLabel.text = i.Diamond.toString(),
                this.PowerLabel.text = i.Power + "/" + i.MaxPower,
                this.IsConutTimer || this.PowerTimeLabel.visible || this.PowerRefresh(),
                this.MateIndex++,
                this.MateIndex >= 0 && this.MateIndex <= 10 ? this.MateLabel.text = "Matching." : this.MateIndex > 10 && this.MateIndex <= 20 ? this.MateLabel.text = "Matching.." : this.MateIndex > 20 && this.MateIndex <= 30 ? this.MateLabel.text = "Matching..." : this.MateIndex > 30 && (this.MateIndex = 0)
        }
        PowerRefresh() {
            if (i.Power < i.MaxPower) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    this.PowerTimeLabel.visible = !0,
                    this.IsConutTimer = !0,
                    Laya.timer.loop(1e3, this, this.CountDown)
            } else this.PowerTimeLabel.visible = !1
        }
        CountDown() {
            if (this.IsConutTimer) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    e <= 0 && (this.IsConutTimer = !1, Laya.timer.clear(this, this.CountDown), i.PowerTimeStamp = 0, r.save_int("PowerTimeStamp", i.PowerTimeStamp), N._Instance.UpdatePower(1), this.PowerRefresh())
            }
        }
        GetMyBadge() {
            let e = 0;
            e = i.Badge <= 2 ? 4 * (i.Badge - 1) + i.BadgeLv : 5 * (i.Badge - 1) + i.BadgeLv - 2;
            let t = o.GetDataRandom({
                arry: [e - 3, e - 2, e - 1, e, e + 1, e + 2, e + 3],
                range: 1
            })[0];
            return t <= 1 && (t = 1),
                t >= 33 && (t = 33),
                t <= 4 ? [1, t] : t > 4 && t <= 8 ? [2, t - 4] : t > 8 && t <= 13 ? [3, t - 8] : t > 13 && t <= 18 ? [4, t - 13] : t > 18 && t <= 23 ? [5, t - 18] : t > 23 && t <= 28 ? [6, t - 23] : t > 28 && t <= 33 ? [7, t - 28] : void 0
        }
        onDisable() {
            L.BannerShowData[18] = !1,
                L.ArenaMateBanner && L.ArenaMateBanner.hide()
        }
    }
    class Z extends e.Scene.MateItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (
                1 == e.isself ? (
                    this.Bg1.visible = !0,
                    this.Bg2.visible = !1,
                    this.Bg3.visible = !1,
                    this.Icon.skin = e.head,
                    this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png",
                    this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1],
                    this.NameLabel.text = e.name
                ) : (
                    this.Bg1.visible = !1,
                    this.Bg2.visible = !0,
                    this.Bg3.visible = !1,
                    this.Icon.skin = "res/Icon/Head/noicon.png",
                    this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png", //"res/Icon/Badge/Badge_01.png", 
                    this.BadgeIcon.gray = !0,
                    this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1], //"???", 
                    this.NameLabel.text = e.name, //"???", 
                    Laya.timer.once(1e3 + 4500 * Math.random(), this, () => {
                        this.Icon.skin = "res/Icon/Head/" + e.head + ".jpg",
                            this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png",
                            this.BadgeIcon.gray = !1,
                            this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1],
                            this.NameLabel.text = e.name
                    })
                )
            )
        }
    }
    class J extends e.Scene.MateItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (
                this.Bg1.visible = !1,
                this.Bg2.visible = !1,
                this.Bg3.visible = !0,
                this.Icon.skin = "res/Icon/Head/noicon.png",
                this.BadgeIcon.skin = "res/Icon/Badge/Badge_01.png",
                this.BadgeIcon.gray = !0,
                this.BadgeLabel.text = "???",
                this.NameLabel.text = "???",
                Laya.timer.once(1e3 + 4500 * Math.random(), this, () => {
                    this.Icon.skin = "res/Icon/Head/" + e.head + ".jpg",
                        this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png",
                        this.BadgeIcon.gray = !1,
                        this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1],
                        this.NameLabel.text = e.name
                })
            )
        }
    }
    class W extends e.Scene.ArenaSettlePanelUI {
        constructor() {
            super(),
                this.IsSettle = !0,
                this.IsWin = !1,
                this.IsDropSP = !1,
                this.GameRankData = [],
                this.MySettleData = [],
                this.EnemySettleData = [],
                this.AwardData = [],
                this.AwardLength = 0,
                this.MyAllKillNum = 0,
                this.MyAllDieNum = 0,
                this.EnemyAllKillNum = 0,
                this.EnemyAllDieNum = 0
        }
        onAwake() {
            W._Instance = this,
                s.MatchScreen(this),
                s.AddBtnAnimation([this.OkBtn]);
            let e = Laya.stage.height / 1334,
                t = Laya.stage.width / 750;
            e >= t ? this.Bg.scale(e, e) : this.Bg.scale(t, t),
                this.GameRankData = N._Instance.GameRankData,
                this.IsDropSP = N._Instance.IsDropSP,
                this.Refresh(),
                N._Instance.ReGame(),
                Laya.SoundManager.stopMusic(),
                this.MyAllKillLabel.text = "0",
                this.MyAllDieLabel.text = "0",
                this.EnemyAllKillLabel.text = "0",
                this.EnemyAllDieLabel.text = "0",
                Laya.timer.frameLoop(1, this, this.Update),
                this.OkBtn.on(Laya.Event.CLICK, this, this.Ok),
                //this.ShareBtn.on(Laya.Event.CLICK, this, this.Share),
                i.IsArenaAwardCallBack || d.SendMsgToServer("export_game", [11], Laya.Handler.create(this, () => {
                    i.IsArenaAwardCallBack = !0
                })),
                s.SetBtnBottom(this.OkBtn, 280),
                //s.SetBtnBottom(this.ShareBtn, 280),
                L.BannerShowData[20] = !0,
                L.CreateBannerAd("adunit-9fc124558920a5ba")
        }
        onEnable() {}
        Refresh() {
            let e = this.GameRankData,
                t = [],
                a = [];
            for (let i = 0; i < e.length; i++) e[i].isteam ? t.push(e[i]) : a.push(e[i]);
            let i = 0,
                s = 0;
            for (let e = 0; e < t.length; e++) i += t[e].killnum,
                s += t[e].dienum;
            let o = 0,
                r = 0;
            for (let e = 0; e < a.length; e++) o += a[e].killnum,
                r += a[e].dienum;
            if (1 == N._Instance.IsArenaWinState ? this.IsWin = !0 : 2 == N._Instance.IsArenaWinState ? this.IsWin = !1 : 3 == N._Instance.IsArenaWinState && (i - s > o - r ? this.IsWin = !0 : i - s < o - r ? this.IsWin = !1 : i - s == o - r && (i > o ? this.IsWin = !0 : i < o ? this.IsWin = !1 : i == o && (s > r ? this.IsWin = !1 : s < r ? this.IsWin = !0 : s == s && (this.IsWin = !0)))), this.winzz.visible = !1, this.IsWin) {
                this.wintp.visible = !0,
                    Laya.Tween.to(this.XinXin, {
                            scaleX: 1,
                            scaleY: 1
                        },
                        500, Laya.Ease.backOut),
                    this.falltp.visible = !1,
                    this.winzz.pos(30, -150),
                    n.PlaySound("ArenaWin");
                for (let e = 0; e < t.length; e++)
                    if (0 == t[e].myid) {
                        t[e].ismvp ? c.SendMsgToServer([{
                                key: "scene",
                                value: 11
                            },
                            {
                                key: "event_code",
                                value: 3
                            },
                            {
                                key: "event_code_sub",
                                value: 1
                            }
                        ]) : c.SendMsgToServer([{
                                key: "scene",
                                value: 11
                            },
                            {
                                key: "event_code",
                                value: 3
                            },
                            {
                                key: "event_code_sub",
                                value: 0
                            }
                        ]);
                        break
                    }
            } else this.wintp.visible = !1,
                this.falltp.visible = !0,
                this.winzz.pos(220, -150),
                n.PlaySound("ArenaFall"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 11
                    },
                    {
                        key: "event_code",
                        value: 4
                    }
                ]);
            this.MySettleData = t,
                this.EnemySettleData = a,
                this.MyMateSet(),
                this.EnemyMateSet()
        }
        MyMateSet() {
            this.MySettleList.itemRender = q,
                this.MySettleData = this.sortFun(this.MySettleData),
                this.MySettleList.array = this.MySettleData,
                this.MySettleList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.GetAwardData()
        }
        freshList1(e, t) {
            e.setShow(this.MySettleData[t])
        }
        EnemyMateSet() {
            this.EnemySettleList.itemRender = Q,
                this.EnemySettleData = this.sortFun(this.EnemySettleData),
                this.EnemySettleList.array = this.EnemySettleData,
                this.EnemySettleList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1)
        }
        freshList2(e, t) {
            e.setShow(this.EnemySettleData[t])
        }
        sortFun(e) {
            e.sort(function(e, t) {
                return e.killnum < t.killnum ? 1 : e.killnum > t.killnum ? -1 : e.killnum == t.killnum ? e.dienum < t.dienum ? -1 : e.dienum > t.dienum ? 1 : 0 : void 0
            });
            for (var t = 0; t < e.length; t++) e[t].delay = 500 * t,
                e[t].ismvp = 0 == t;
            return e
        }
        WinZZTween() {
            this.IsWin || (this.TipsLabel.visible = !0, this.TipsLabel.scale(0, 0), Laya.Tween.to(this.TipsLabel, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    300, Laya.Ease.backOut)),
                this.winzz.visible = !0;
            let e = 280,
                t = 470;
            this.IsWin ? (e = 280, t = 100) : (e = 470, t = 100),
                Laya.Tween.to(this.winzz, {
                        x: e,
                        y: t
                    },
                    150, null, Laya.Handler.create(this, () => {
                        n.PlaySound("gaizhang"),
                            W._Instance.IsSettle = !1
                    }), 200)
        }
        GetAwardData() {
            let e = [
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0]
            ];
            for (let t = 0; t < this.MySettleData.length; t++)
                if (0 == this.MySettleData[t].myid) {
                    let a = this.MySettleData[t];
                    e[0][1] += 20 * a.killnum,
                        this.IsWin ? (e[0][1] += 50, e[1][1] += 50, e[2][1] += 10, a.ismvp && (e[0][1] += 200, e[1][1] += 50, e[2][1] += 20, this.IsDropSP && (e[3][1] += 1))) : a.ismvp && (e[0][1] += 100, e[1][1] += 50, e[2][1] += 10);
                    break
                }
            this.AwardData = e;
            for (let e = 0; e < this.AwardData.length; e++) 0 != this.AwardData[e][1] && this.AwardLength++;
            console.log(this.AwardData)
        }
        Ok() {
            n.PlaySound("click"),
                this.IsSettle ?
                platform.getInstance().prompt("Counting your result...") :
                this.AwardLength <= 0 ? Laya.View.open("Scene/StartPanel.scene") : Laya.View.open("Scene/ArenaAwardPanel.scene", !0, [this.AwardData])
        }
        Share() {
            n.PlaySound("click"),
                this.IsSettle ?
                platform.getInstance().prompt("Counting your result...") :
                X.ShareApp([0, 1, 2, 3, 4, 5], "")
        }
        Update() {
            this.MyAllKillLabel.text = this.MyAllKillNum.toString(),
                this.MyAllDieLabel.text = this.MyAllDieNum.toString(),
                this.EnemyAllKillLabel.text = this.EnemyAllKillNum.toString(),
                this.EnemyAllDieLabel.text = this.EnemyAllDieNum.toString()
        }
        onDisable() {
            L.BannerShowData[20] = !1,
                L.ArenaSettleBanner && L.ArenaSettleBanner.hide()
        }
    }
    class q extends e.Scene.ArenaSettleItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (this.x = -388, 1 == e.isself ? this.Bg.visible = !0 : this.Bg.visible = !1, e.ismvp ? this.MvpTP.visible = !0 : this.MvpTP.visible = !1, this.Icon.skin = e.head, this.NameLabel.color = "#0FDAFF", this.NameLabel.text = e.name, this.KillLabel.text = e.killnum + "", this.DileLabel.text = e.dienum + "", Laya.Tween.to(this, {
                    x: 0
                },
                500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    W._Instance.MyAllKillNum += e.killnum,
                        W._Instance.MyAllDieNum += e.dienum,
                        Math.round(e.delay) >= 2e3 && W._Instance.WinZZTween()
                }), e.delay))
        }
    }
    class Q extends e.Scene.ArenaSettleItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (this.x = 388, 1 == e.isself ? this.Bg.visible = !0 : this.Bg.visible = !1, e.ismvp ? this.MvpTP.visible = !0 : this.MvpTP.visible = !1, this.Icon.skin = e.head, this.NameLabel.color = "#FF3140", this.NameLabel.text = e.name, this.KillLabel.text = e.killnum + "", this.DileLabel.text = e.dienum + "", Laya.Tween.to(this, {
                    x: 0
                },
                500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                    W._Instance.EnemyAllKillNum += e.killnum,
                        W._Instance.EnemyAllDieNum += e.dienum
                }), e.delay))
        }
    }
    class $ extends e.Scene.BadgeLvPanelUI {
        constructor() {
            super()
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                this.SkipBtn.visible = !1,
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                Laya.timer.frameLoop(1, this, this.Update)
        }
        onOpened(e) {
            e && (c.SendMsgToServer([{
                    key: "scene",
                    value: 10
                },
                {
                    key: "event_code",
                    value: 1
                },
                {
                    key: "u_lev",
                    value: i.Badge
                }
            ]), this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e[0] + ".png", this.BadgeLabel.text = i.BadgeData[e[0] - 1] + i.BadgeLvData[e[1] - 1], Laya.timer.once(500, this, () => {
                let e = new Laya.Skeleton;
                this.LvBox.addChild(e),
                    e.pos(0, 0),
                    e.load("res/UIEffect/BadgeLvEffect/asdasd.sk", new Laya.Handler(this, () => {
                            e.play(0, !1)
                        },
                        null, !0)),
                    Laya.Tween.to(this.BadgeIcon, {
                            scaleX: .8,
                            scaleY: .8
                        },
                        300, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                            n.PlaySound("badgelv"),
                                Laya.Tween.to(this.BadgeIcon, {
                                        scaleX: .6,
                                        scaleY: .6
                                    },
                                    300, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.BadgeIcon, {
                                                scaleX: 0,
                                                scaleY: 0
                                            },
                                            500, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                                                this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + i.Badge + ".png",
                                                    this.BadgeLabel.text = i.BadgeData[i.Badge - 1] + i.BadgeLvData[i.BadgeLv - 1],
                                                    1 == i.Badge && 2 == i.BadgeLv && (
                                                        i.IsOpenShouZhi = !0,
                                                        platform.getInstance().prompt("Congratulations on unlocking the arena. Go and experience it~", 3e3)
                                                    ),
                                                    Laya.Tween.to(this.BadgeIcon, {
                                                            scaleX: 1,
                                                            scaleY: 1
                                                        },
                                                        500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                                            i.MaxLevel > 3 && Math.random() >= .5 && (L.IsShowBadgeLvInterstitialAd = !0, L.CreateInterstitialAd("adunit-0d94a2abf9cfe6b2")),
                                                                1 == i.BannerSwitch ? Laya.timer.once(500, this, () => {
                                                                    this.SkipBtn.visible = !0
                                                                }) : this.SkipBtn.visible = !0
                                                        }))
                                            }))
                                    }))
                        }))
            }))
        }
        onEnable() {}
        Skip() {
            n.PlaySound("click"),
                this.close()
        }
        Update() {
            this.ZZTP.rotation += .5
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.IsShowBadgeLvInterstitialAd = !1
        }
    }
    class ee extends e.Scene.BossSharePanelUI {
        constructor() {
            super(),
                this.ShowTime = 0,
                this.HideTime = 0,
                this.ShareNum = 0,
                this.ShareMsgData = ["分享失败，再分享试一下！", "好友网络故障，重新试试！"]
        }
        onAwake() {
            ee._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.ShareBtn, this.SkipBtn]),
                N._Instance.LoadEffectRes(),
                this.onShow(),
                this.onHide(),
                this.ShareBtn.on(Laya.Event.CLICK, this, this.Share),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.CreateWXODW(),
                X.GetFriendRank("BossShare"),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[16] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-cf403df1370c0ec0")
        }
        onEnable() {}
        Share() {
            n.PlaySound("click"),
                X.GetFriendRank("BossShareBtn")
        }
        Skip() {
            n.PlaySound("click"),
                N._Instance.IsBossRemoveHp = 1,
                N._Instance.StartGame()
        }
        onShow() {
            window.wx && window.wx.onShow(function(e) {
                ee._Instance.ShowTime = (new Date).getTime(),
                    ee._Instance.ShowTime - ee._Instance.HideTime < 3e3 ? (ee._Instance.ShareNum++, ee._Instance.ShareNum >= 2 ? (ee._Instance.ShareNum = 0, ee._Instance.ShareCallBack()) : platform.getInstance().prompt(o.GetDataRandom({
                        arry: ee._Instance.ShareMsgData,
                        range: 1
                    })[0])) : (ee._Instance.ShareNum = 0, ee._Instance.ShareCallBack())
            })
        }
        onHide() {
            window.wx && window.wx.onHide(function(e) {
                ee._Instance.HideTime = (new Date).getTime()
            })
        }
        CloseCue() {
            window.wx && (window.wx.offShow(), window.wx.offHide())
        }
        ShareCallBack() {
            c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 8
                    }
                ]),
                platform.getInstance().prompt("邀请成功！Boss血量减少50%！"),
                N._Instance.IsBossRemoveHp = 2,
                N._Instance.StartGame()
        }
        CreateWXODW() {
            this.WXOpenDataViewer = this.addChild(Laya.Pool.getItemByClass("WXOpenDataViewer", Laya.WXOpenDataViewer)),
                this.WXOpenDataViewer.width = 750,
                this.WXOpenDataViewer.height = 1334,
                this.WXOpenDataViewer.centerX = 0,
                this.WXOpenDataViewer.centerY = 0,
                this.WXOpenDataViewer.visible = !0
        }
        onDisable() {
            L.BannerShowData[16] = !1,
                L.BossShareBanner && L.BossShareBanner.hide(),
                this.CloseCue(),
                X.GetFriendRank("CloseBox"),
                this.WXOpenDataViewer.removeSelf(),
                Laya.Pool.recover("WXOpenDataViewer", this.WXOpenDataViewer)
        }
    }
    class te extends e.Scene.BuffPanelUI {
        constructor() {
            super(),
                this.BuffId = 1,
                this.IsMFBuff = !1,
                this.MiniUpData = [],
                this.MiniDownData = [],
                this.scroll = 0,
                this.scroll1 = 0,
                this.IsMove = 60,
                this.IsMove1 = 60
        }
        onAwake() {
            switch (s.MatchScreen(this, this.Bg), s.AddBtnAnimation([this.GetBuffBtn, this.SkipBtn]), N._Instance.LoadEffectRes(), this.GetBuffBtn.on(Laya.Event.CLICK, this, this.GetBuff), this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip), this.BuffId = o.GetDataRandom({
                arry: [1, 2, 3],
                range: 1
            })[0], 2 == i.MaxLevel && (this.BuffId = 2), this.BuffId) {
                case 1:
                    this.BuffLabel.text = "Initial length+5",
                        this.BuffTP1.visible = !0,
                        this.BuffTP2.visible = !1,
                        this.BuffTP3.visible = !1;
                    break;
                case 2:
                    this.BuffLabel.text = "Initial size+50%",
                        this.BuffTP1.visible = !1,
                        this.BuffTP2.visible = !0,
                        this.BuffTP3.visible = !1;
                    break;
                case 3:
                    this.BuffLabel.text = "10s initial speed+20%",
                        this.BuffTP1.visible = !1,
                        this.BuffTP2.visible = !1,
                        this.BuffTP3.visible = !0
            }
            1 == i.IsMFBuff ? (this.IsMFBuff = !1, this.videotp.visible = !0, this.lqtp.visible = !0, this.mflqtp.visible = !1) : (this.IsMFBuff = !0, this.videotp.visible = !1, this.lqtp.visible = !1, this.mflqtp.visible = !0),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[1] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-00c645a1e67dc641"),
                i.IsBuffUpCallback ? this.MiniUpCallBack() : d.SendMsgToServer("export_game", [7], Laya.Handler.create(this, this.MiniUpCallBack)),
                i.IsBuffDownCallback ? this.MiniDownCallBack() : d.SendMsgToServer("export_game", [8], Laya.Handler.create(this, this.MiniDownCallBack))
        }
        MiniUpCallBack() {
            i.IsBuffUpCallback = !0,
                1 == i.ExportSwitch && 1 == i.BuffSwitch && i.BuffUpGameData.length > 0 ? (this.ExportUpTP.visible = !0, this.MiniSet()) : this.ExportUpTP.visible = !1
        }
        MiniDownCallBack() {
            i.IsBuffDownCallback = !0,
                1 == i.ExportSwitch && 1 == i.BuffSwitch && i.BuffDownGameData.length > 0 ? (this.ExportDownTP.visible = !0, this.MiniSet1()) : this.ExportDownTP.visible = !1
        }
        onEnable() {}
        GetBuff() {
            n.PlaySound("click"),
                this.IsMFBuff ? (
                    i.IsMFBuff = 1,
                    r.save_int("IsMFBuff", i.IsMFBuff),
                    this.BuffCallBack()
                ) : (
                    platform.getInstance().showReward(() => {
                        this.BuffCallBack()
                    })
                )
        }
        BuffCallBack() {
            switch (N._Instance.PlayerBuffType = this.BuffId, this.BuffId) {
                case 1:
                    platform.getInstance().prompt("Initial length+5");
                    break;
                case 2:
                    platform.getInstance().prompt("Initial size+50%");
                    break;
                case 3:
                    platform.getInstance().prompt("10s initial speed+20%");
            }
            N._Instance.StartGame()
        }
        Skip() {
            n.PlaySound("click"),
                //console.log("执行"),
                N._Instance.StartGame()
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[1] = !1,
                L.BuffBanner && L.BuffBanner.hide()
        }
        MiniSet() {
            this.ExportUpList.itemRender = ae,
                this.ExportUpList.hScrollBarSkin = null,
                this.MiniUpData = i.BuffUpGameData,
                this.ExportUpList.array = this.MiniUpData,
                this.ExportUpList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.MiniUpScoll()
        }
        freshList1(e, t) {
            e.setShow(this.MiniUpData[t])
        }
        MiniSet1() {
            this.ExportDownList.itemRender = ae,
                this.ExportDownList.hScrollBarSkin = null,
                this.MiniDownData = i.BuffDownGameData,
                this.ExportDownList.array = this.MiniDownData,
                this.ExportDownList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1),
                this.MiniDownScoll()
        }
        freshList2(e, t) {
            e.setShow(this.MiniDownData[t])
        }
        MiniUpScoll() {
            this.MiniUpData.length <= 5 || (Laya.timer.loop(30, this, this.MiniUpScollLoop), this.ExportUpList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove = 0
            }))
        }
        MiniDownScoll() {
            this.MiniDownData.length <= 5 || (Laya.timer.loop(30, this, this.MiniDownScollLoop), this.ExportDownList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove1 = 0
            }))
        }
        MiniUpScollLoop() {
            if (this.IsMove >= 60)
                if (0 == this.scroll) {
                    this.ExportUpList.scrollBar.value += 2;
                    var e = this.MiniUpData.length;
                    this.ExportUpList.scrollBar.value >= 69 * e && (this.ExportUpList.scrollBar.value = 69 * e, this.scroll = 69 * e)
                } else this.ExportUpList.scrollBar.value -= 2,
                    this.ExportUpList.scrollBar.value <= 0 && (this.ExportUpList.scrollBar.value = 0, this.scroll = 0);
            else this.IsMove++
        }
        MiniDownScollLoop() {
            if (this.IsMove1 >= 60)
                if (0 == this.scroll1) {
                    this.ExportDownList.scrollBar.value += 2;
                    var e = this.MiniDownData.length;
                    this.ExportDownList.scrollBar.value >= 69 * e && (this.ExportDownList.scrollBar.value = 69 * e, this.scroll1 = 69 * e)
                } else this.ExportDownList.scrollBar.value -= 2,
                    this.ExportDownList.scrollBar.value <= 0 && (this.ExportDownList.scrollBar.value = 0, this.scroll1 = 0);
            else this.IsMove1++
        }
    }
    class ae extends e.Scene.ExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class ie extends e.Scene.DowerPanelUI {
        constructor() {
            super(),
                this.DowerData = []
        }
        onAwake() {
            ie._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.DowerSet(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[6] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-139fc91faf13e7ff")
        }
        onEnable() {}
        Skip() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        DowerSet() {
            console.log(i.DowerData),
                this.DowerData = i.DowerData,
                this.DowerList.itemRender = se,
                this.DowerList.array = this.DowerData,
                this.DowerList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.DowerData[t])
        }
        GetDowerLv(e) {
            for (let t = 0; t < i.DowerData.length; t++)
                if (i.DowerData[t].dowertype == e) {
                    return i.DowerData[t].dowerlv + 1
                }
        }
        onDisable() {
            L.BannerShowData[6] = !1,
                L.SkinBanner && L.SkinBanner.hide()
        }
    }
    class se extends e.Scene.StartDowerItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this.UpLvBtn])
        }
        setShow(e) {
            if (e) {
                switch (e.dowertype) {
                    case 1:
                        this.TipsLabel.text = "Tail Length+" + e.dowerlv,
                            this.NextlvLabel.text = "+" + (e.dowerlv + 1);
                        break;
                    case 2:
                        this.TipsLabel.text = "Move Speed+" + 5 * e.dowerlv + "%",
                            this.NextlvLabel.text = "+" + 5 * (e.dowerlv + 1) + "%";
                        break;
                    case 3:
                        0 == e.dowerlv ? (
                            this.TipsLabel.text = "Init Volume+0%",
                            this.NextlvLabel.text = "+10%"
                        ) : (
                            this.TipsLabel.text = "Init Volume+" + (5 + 5 * (e.dowerlv)) + "%",
                            this.NextlvLabel.text = "+" + (5 + 5 * (e.dowerlv + 1)) + "%"
                        )
                }
                e.dowerlv >= 9 ? (this.sjtp.visible = !1, this.ymjtp.visible = !0, this.UpLvBtn.gray = !0, this.DiamondLabel.visible = !1, this.zstp.visible = !1, this.UpLvBtn.pos(536.5, 50), this.jttp.visible = !1, this.NextlvLabel.visible = !1) : (this.sjtp.visible = !0, this.ymjtp.visible = !1, this.UpLvBtn.gray = !1, this.DiamondLabel.visible = !0, this.DiamondLabel.text = "-" + e.diamonddata[e.dowerlv], this.zstp.visible = !0, this.UpLvBtn.pos(536.5, 38.5), this.jttp.visible = !0, this.NextlvLabel.visible = !0, this.TipsLabel.pos(175, 50)),
                    this.UpLvBtn.on(Laya.Event.CLICK, this, this.UpLv, [e])
            }
            this.TipsLabel.fontSize = 30;
            this.NextlvLabel.fontSize = 30;
        }
        UpLv(e) {
            n.PlaySound("click"),
                e.dowerlv >= 9 ? (
                    platform.getInstance().prompt("This skill is full！")
                ) : i.Diamond >= e.diamonddata[e.dowerlv] ? (c.SendMsgToServer([{
                            key: "scene",
                            value: 5
                        },
                        {
                            key: "event_code",
                            value: 4
                        },
                        {
                            key: "talent_type",
                            value: e.dowertype
                        },
                        {
                            key: "u_lev",
                            value: ie._Instance.GetDowerLv(e.dowertype)
                        }
                    ]),
                    N._Instance.UpdateDiamond(-e.diamonddata[e.dowerlv]),
                    platform.getInstance().prompt("Upgrade Successfully!"),
                    N._Instance.UpdateDowerLv(e.dowertype),
                    ie._Instance.DowerSet()) : e.diamonddata[e.dowerlv] - i.Diamond <= 100 ? (
                    platform.getInstance().prompt("diamond is not enough！"),
                    Laya.View.open("Scene/VideoDowerPanel.scene", !1, [e])) : (
                    platform.getInstance().prompt("diamond is not enough！", 500),
                    Laya.timer.once(500, this, () => {
                        Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetDiamond", 0])
                    }))
        }
    }
    class ne extends e.Scene.SettlePanelUI {
        constructor() {
            super(),
                this.IsSettle = !0,
                this.SettleRankData = [],
                this.GetExp = 0,
                this.PlayerRank = 1,
                this.CurrLevel = 1,
                this.ToPos = new Laya.Vector2(0, 0)
        }
        onAwake() {
            ne._Instance = this,
                N._Instance.PlayerTrySkinId = 0,
                X.ShareNum = 0,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn, this.DoubleBtn]),
                s.TopUIMatch(this.TopBox, 0),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.DoubleBtn.on(Laya.Event.CLICK, this, this.Double),
                //this.ShareGoldBtn.on(Laya.Event.CLICK, this, this.ShareGold),
                //this.ShareDiamondBtn.on(Laya.Event.CLICK, this, this.ShareDiamond),
                //console.log("UserData.SettleShareData", i.SettleShareData),
                //i.SettleShareData.issharegold ? this.ShareGoldBtn.visible = !1 : (this.ShareGoldBtn.visible = !0, this.ShareGoldTween()),
                //i.SettleShareData.issharediamond ? this.ShareDiamondBtn.visible = !1 : (this.ShareDiamondBtn.visible = !0, this.ShareDiamondTween()),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                this.CurrLevel = i.MaxLevel,
                this.CurrLevel > 3 ? (this.SkipBtn.visible = !1, 1 == i.BannerSwitch ? Laya.timer.once(3e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0) : (this.SkipBtn.visible = !0, this.SkipBtn.scale(1.5, 1.5)),
                this.SettleRankSet(N._Instance.GameRankData),
                this.CurrLevel % 10 == 0 || 6 == this.CurrLevel ? 1 == this.PlayerRank && N._Instance.EnemyBox.numChildren <= 0 ? (this.caidai1.visible = !1, this.caidai2.visible = !0, this.caidai3.visible = !1, this.CurrLevel > 15 && i.StreakWinNum++, i.StreakFallNum = 0, c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 5
                    },
                    {
                        key: "event_code_sub",
                        value: 0
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ]), i.IsShowBuff = !1) : (this.caidai1.visible = !1, this.caidai2.visible = !1, this.caidai3.visible = !0, i.StreakWinNum = 0, i.StreakFallNum++, c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 3
                    },
                    {
                        key: "event_code_sub",
                        value: 0
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ]), i.IsShowBuff = !0) : (this.caidai1.visible = !0, this.caidai2.visible = !1, this.caidai3.visible = !1, 1 == this.PlayerRank ? (c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 5
                    },
                    {
                        key: "event_code_sub",
                        value: 0
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ]), N._Instance.UpdateLevel(), this.CurrLevel > 15 && i.StreakWinNum++, i.StreakFallNum = 0, i.IsShowBuff = !1) : (c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 3
                    },
                    {
                        key: "event_code_sub",
                        value: 0
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ]), i.StreakWinNum = 0, i.StreakFallNum++, i.IsShowBuff = !0)),
                Laya.timer.clearAll(N._Instance);
            for (let e = 0; e < N._Instance.EnemyBox.numChildren; e++) N._Instance.EnemyBox.getChildAt(e).removeSelf(),
                e--;
            n.PlaySound("Settlement"),
                this.Refresh(),
                Laya.timer.frameLoop(1, this, this.Update),
                Laya.SoundManager.stopMusic(),
                //s.SetBtnBottom(this.ShareGoldBtn, 390),
                //s.SetBtnBottom(this.ShareDiamondBtn, 390),
                s.SetBtnBottom(this.DoubleBtn, 370),
                L.BannerShowData[3] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-c465d47c15eafdad"),
                i.IsSettleCallback || d.SendMsgToServer("export_game", [6], Laya.Handler.create(this, () => {
                    i.IsSettleCallback = !0
                })),
                i.IsSettleTJUpCallBack || d.SendMsgToServer("export_game", [12], Laya.Handler.create(this, () => {
                    i.IsSettleTJUpCallBack = !0
                })),
                i.IsSettleTJDownCallBack || d.SendMsgToServer("export_game", [13], Laya.Handler.create(this, () => {
                    i.IsSettleTJDownCallBack = !0
                }))
        }
        onEnable() {}
        SettleRankSet(e) {
            this.SettleRankList.itemRender = oe,
                this.SettleRankList.vScrollBarSkin = null,
                this.SettleRankList.scrollBar.touchScrollEnable = !1,
                this.IsSettle = !0;
            let t = this.sortFun(e),
                a = [];
            if (this.CurrLevel % 10 == 0 || 6 == this.CurrLevel)
                for (let e = 0; e < t.length; e++) 0 == t[e].myid && (t[e].rank = 1, a.push(t[e]));
            else a = t;
            this.SettleRankData = a,
                this.SettleRankList.array = this.SettleRankData;
            for (let e = 0; e < this.SettleRankData.length; e++)
                if (1 == this.SettleRankData[e].isself) {
                    if (this.PlayerRank = this.SettleRankData[e].rank, this.KillLabel.text = this.SettleRankData[e].killnum + "", this.GetExp = this.SettleRankData[e].exp,
                        console.log("exp：", i.Exp), this.SettleRankData[e].rank >= 6) {
                        this.SettleRankList.scrollTo(5);
                        for (let e = 0; e < this.SettleRankData.length; e++) this.CurrLevel >= 9 ? e >= 5 && (this.SettleRankData[e].delay = 250 * (9 - e)) : 5 == this.CurrLevel || 7 == this.CurrLevel ? e >= 1 && (this.SettleRankData[e].delay = 250 * (5 - e)) : 8 == this.CurrLevel && e >= 3 && (this.SettleRankData[e].delay = 250 * (7 - e))
                    } else if (this.SettleRankList.scrollTo(this.SettleRankData[e].rank - 1), this.CurrLevel >= 9) {
                        let t = this.SettleRankData[e].rank - 1,
                            a = 5;
                        a = this.SettleRankData.length <= 5 ? this.SettleRankData.length : 5;
                        for (let e = 0; e < this.SettleRankData.length; e++) e == t && a > 0 && (t++, a--, this.SettleRankData[e].delay = 250 * a)
                    } else
                        for (let e = 0; e < this.SettleRankData.length; e++) 5 == this.CurrLevel || 7 == this.CurrLevel ? 1 != this.PlayerRank ? e >= 1 && (this.SettleRankData[e].delay = 250 * (5 - e)) : e <= 4 && (this.SettleRankData[e].delay = 250 * (4 - e)) : 6 == this.CurrLevel ? this.SettleRankData[e].delay = 0 : 8 == this.CurrLevel && (4 == this.PlayerRank || 5 == this.PlayerRank ? e >= 3 && (this.SettleRankData[e].delay = 250 * (7 - e)) : 3 == this.PlayerRank ? e >= 2 && (this.SettleRankData[e].delay = 250 * (6 - e)) : 2 == this.PlayerRank ? e >= 1 && (this.SettleRankData[e].delay = 250 * (5 - e)) : 1 == this.PlayerRank && (this.SettleRankData[e].delay = 250 * (4 - e)));
                    if (1 == this.CurrLevel)
                        for (let e = 0; e < this.SettleRankData.length; e++) this.SettleRankData[e].delay = 250 * (2 - e);
                    else if (2 == this.CurrLevel || 3 == this.CurrLevel)
                        for (let e = 0; e < this.SettleRankData.length; e++) this.SettleRankData[e].delay = 250 * (3 - e);
                    break
                }
            console.log(this.SettleRankData),
                this.SettleRankList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.SettleRankData[t])
        }
        sortFun(e) {
            e.sort(function(e, t) {
                if (e.islive < t.islive) return 1;
                if (e.islive > t.islive) return -1;
                if (e.islive == t.islive) {
                    if (e.killnum > t.killnum) return -1;
                    if (e.killnum < t.killnum) return 1;
                    if (e.killnum == t.killnum) return e.dietime > t.dietime ? -1 : e.dietime < t.dietime ? 1 : 0
                }
            });
            for (var t = 0; t < e.length; t++) e[t].rank = t + 1;
            return e
        }
        Double() {
            n.PlaySound("click"),
                this.IsSettle ? platform.getInstance().prompt("Counting your result...") : (
                    platform.getInstance().showReward(() => {
                        Laya.View.open("Scene/SettleLotteryPanel.scene", !1)
                        this.DoubleBtn.visible = !1;
                    })
                )
        }
        ShareGold() {
            n.PlaySound("click"),
                this.IsSettle ? platform.getInstance().prompt("Counting your result...") : X.ShareApp([0, 1, 2, 3, 4, 5], "SettleShare", Laya.Handler.create(this, () => {
                    if (c.SendMsgToServer([{
                                key: "scene",
                                value: 1
                            },
                            {
                                key: "event_code",
                                value: 10
                            }
                        ]), platform.getInstance().prompt("Share success！"), Laya.View.open("Scene/GetAwardPanel.scene", !1, ["SettleShareGold"]), X.ShareNum = 0,
                        //this.ShareGoldBtn.visible = !1, 
                        this.CurrLevel == i.SettleShareData.level) {
                        i.SettleShareData.issharegold = !0;
                        let e = JSON.stringify(i.SettleShareData);
                        r.save_string("SettleShareData", e)
                    }
                }))
        }
        ShareDiamond() {
            n.PlaySound("click"),
                this.IsSettle ? platform.getInstance().prompt("Counting your result...") : X.ShareApp([0, 1, 2, 3, 4, 5], "SettleShare", Laya.Handler.create(this, () => {
                    if (c.SendMsgToServer([{
                                key: "scene",
                                value: 1
                            },
                            {
                                key: "event_code",
                                value: 11
                            }
                        ]), platform.getInstance().prompt("Share success！"), Laya.View.open("Scene/GetAwardPanel.scene", !1, ["SettleShareDiamond"]), X.ShareNum = 0,
                        //this.ShareDiamondBtn.visible = !1, 
                        this.CurrLevel == i.SettleShareData.level) {
                        i.SettleShareData.issharediamond = !0;
                        let e = JSON.stringify(i.SettleShareData);
                        r.save_string("SettleShareData", e)
                    }
                }))
        }
        AddDoubleExp(e) {
            this.SettleRankList.scrollBar.touchScrollEnable = !1,
                this.IsSettle = !0,
                n.PlaySound("gotGold"),
                s.flyDiamondAni("res/Icon/exp.png", this.ToPos.x, this.ToPos.y + 180, this.Exp.x, this.Exp.y, this, Laya.Handler.create(this, () => {
                    N._Instance.UpdateBadgeLv((e - 1) * this.GetExp) ? Laya.timer.once(400, this, () => {
                        this.SettleRankList.scrollBar.touchScrollEnable = !0,
                            this.IsSettle = !1
                    }) : (this.SettleRankList.scrollBar.touchScrollEnable = !0, this.IsSettle = !1)
                }))
        }
        Skip() {
            n.PlaySound("click"),
                this.IsSettle ?
                platform.getInstance().prompt("Counting your result...") :
                1 == i.ExportSwitch && i.SettleTJUpGameData.length > 0 && i.SettleTJDownGameData.length > 0 &&
                1 == i.SettleSwitch && (1 == i.OverSwitchSub || i.MaxLevel >= 3) ?
                Laya.View.open("Scene/RecommendPanel.scene", !1, [this.PlayerRank, this.CurrLevel, 1]) :
                1 == i.ExportSwitch && i.SettleExportGameData.length > 0 && 1 == i.SettleSwitch &&
                (1 == i.OverSwitchSub || i.MaxLevel >= 3) ?
                Laya.View.open("Scene/SettleExportPanel.scene", !1, [this.PlayerRank, this.CurrLevel, 1]) :
                (1 != this.PlayerRank ?
                    Laya.View.open("Scene/StartPanel.scene", !0, [1, 0]) :
                    this.CurrLevel % 10 == 0 || 6 == this.CurrLevel ?
                    Laya.View.open("Scene/StartPanel.scene", !0, [1, 1]) :
                    Laya.View.open("Scene/StartPanel.scene", !0, [1, 2]),
                    N._Instance.ReGame()
                )
        }
        Update() {
            this.BadgeLabel.text = i.BadgeData[i.Badge - 1] + i.BadgeLvData[i.BadgeLv - 1],
                this.ExpLabel.text = i.Exp + "/" + i.MaxExp,
                this.ExpJDT.width = i.Exp / i.MaxExp * 290
        }
        Refresh() {
            this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + i.Badge + ".png"
        }
        TagTween(e) {
            e ? (this.wintp.visible = !1, this.wintp.scale(2, 2), this.wintp.pos(530, -45), this.wintp.visible = !0, Laya.Tween.to(this.wintp, {
                    scaleX: 1,
                    scaleY: 1,
                    x: 691,
                    y: 111
                },
                100, null, Laya.Handler.create(this, () => {
                    n.PlaySound("gaizhang")
                }))) : (this.falltp.visible = !1, this.falltp.scale(2, 2), this.falltp.pos(530, -45), this.falltp.visible = !0, Laya.Tween.to(this.falltp, {
                    scaleX: 1,
                    scaleY: 1,
                    x: 691,
                    y: 111
                },
                100, null, Laya.Handler.create(this, () => {
                    n.PlaySound("gaizhang")
                })))
        }
        ShareGoldTween() {
            Laya.Tween.to(this.GoldTP, {
                    scaleX: .8,
                    scaleY: .8
                },
                500, Laya.Ease.backOut, Laya.Handler.create(this, this.ShareGoldTween1))
        }
        ShareGoldTween1() {
            Laya.Tween.to(this.GoldTP, {
                    rotation: 5
                },
                500, null, Laya.Handler.create(this, this.ShareGoldTween2))
        }
        ShareGoldTween2() {
            Laya.Tween.to(this.GoldTP, {
                    rotation: -5
                },
                1e3, null, Laya.Handler.create(this, this.ShareGoldTween3))
        }
        ShareGoldTween3() {
            Laya.Tween.to(this.GoldTP, {
                    rotation: 5
                },
                1e3, null, Laya.Handler.create(this, this.ShareGoldTween2))
        }
        ShareDiamondTween() {
            Laya.Tween.to(this.DiamondTP, {
                    scaleX: .8,
                    scaleY: .8
                },
                500, Laya.Ease.backOut, Laya.Handler.create(this, this.ShareDiamondTween1))
        }
        ShareDiamondTween1() {
            Laya.Tween.to(this.DiamondTP, {
                    rotation: 5
                },
                500, null, Laya.Handler.create(this, this.ShareDiamondTween2))
        }
        ShareDiamondTween2() {
            Laya.Tween.to(this.DiamondTP, {
                    rotation: -5
                },
                1e3, null, Laya.Handler.create(this, this.ShareDiamondTween3))
        }
        ShareDiamondTween3() {
            Laya.Tween.to(this.DiamondTP, {
                    rotation: 5
                },
                1e3, null, Laya.Handler.create(this, this.ShareDiamondTween2))
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[3] = !1,
                L.SettleBanner && L.SettleBanner.hide()
        }
    }
    class oe extends e.Scene.SettleItemUI {
        constructor() {
            super(),
                this.istween = !1
        }
        setShow(e) {
            if (e) {
                if (this.Icon.skin = "", 1 == e.isself)
                    if (this.Bg1.visible = !0, this.Bg2.visible = !1, ne._Instance.CurrLevel <= 10) 1 == ne._Instance.CurrLevel ? 1 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 2 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y) : 3 == e.rank && (ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y)) : 2 == ne._Instance.CurrLevel || 3 == ne._Instance.CurrLevel ? 1 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 2 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y) : 3 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y) : 4 == e.rank && (ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box4.x, ne._Instance.Box4.y)) : 6 == ne._Instance.CurrLevel || 10 == ne._Instance.CurrLevel ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 5 == ne._Instance.CurrLevel || 7 == ne._Instance.CurrLevel ? 1 == e.rank || 2 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 3 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y) : 4 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y) : 5 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box4.x, ne._Instance.Box4.y) : 6 == e.rank && (ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box5.x, ne._Instance.Box5.y)) : 8 == ne._Instance.CurrLevel ? 1 == e.rank || 2 == e.rank || 3 == e.rank || 4 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 5 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y) : 6 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y) : 7 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box4.x, ne._Instance.Box4.y) : 8 == e.rank && (ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box5.x, ne._Instance.Box5.y)) : 9 == ne._Instance.CurrLevel && (1 == e.rank || 2 == e.rank || 3 == e.rank || 4 == e.rank || 5 == e.rank || 6 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y) : 7 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y) : 8 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y) : 9 == e.rank ? ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box4.x, ne._Instance.Box4.y) : 10 == e.rank && (ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box5.x, ne._Instance.Box5.y)));
                    else switch (e.rank) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                            ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box1.x, ne._Instance.Box1.y);
                            break;
                        case 7:
                            ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box2.x, ne._Instance.Box2.y);
                            break;
                        case 8:
                            ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box3.x, ne._Instance.Box3.y);
                            break;
                        case 9:
                            ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box4.x, ne._Instance.Box4.y);
                            break;
                        case 10:
                            ne._Instance.ToPos = new Laya.Vector2(ne._Instance.Box5.x, ne._Instance.Box5.y)
                    } else this.Bg1.visible = !1,
                        this.Bg2.visible = !0;
                !e.delay && 0 != e.delay || this.istween || (this.x = 720, Laya.Tween.to(this, {
                            x: 0
                        },
                        500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                            this.istween = !0,
                                console.log(e),
                                0 == e.myid && 1 == e.rank && 20 != e.exp && ne._Instance.TagTween(!0),
                                (ne._Instance.CurrLevel % 10 == 0 && 0 == e.myid && 20 == e.exp || 6 == ne._Instance.CurrLevel && 0 == e.myid && 20 == e.exp) && ne._Instance.TagTween(!1),
                                (1e3 == e.delay || ne._Instance.CurrLevel % 10 == 0 || 6 == ne._Instance.CurrLevel || 1 == ne._Instance.CurrLevel && 500 == e.delay || 2 == ne._Instance.CurrLevel && 750 == e.delay || 3 == ne._Instance.CurrLevel && 750 == e.delay) && ((ne._Instance.CurrLevel % 10 == 0 && 0 == e.myid && 1 == e.rank && 20 != e.exp || 6 == ne._Instance.CurrLevel && 0 == e.myid && 1 == e.rank && 20 != e.exp) && N._Instance.UpdateLevel(), n.PlaySound("gotGold"), s.flyDiamondAni("res/Icon/exp.png", ne._Instance.ToPos.x, ne._Instance.ToPos.y + 180, ne._Instance.Exp.x, ne._Instance.Exp.y, ne._Instance, Laya.Handler.create(this, () => {
                                    N._Instance.UpdateBadgeLv(ne._Instance.GetExp) ? Laya.timer.once(400, this, () => {
                                        ne._Instance.SettleRankList.scrollBar.touchScrollEnable = !0,
                                            ne._Instance.IsSettle = !1
                                    }) : (
                                        ne._Instance.SettleRankList.scrollBar.touchScrollEnable = !0,
                                        ne._Instance.IsSettle = !1
                                        // 	Laya.timer.once(400, this, () =>{
                                        // 	Math.random() > .5 && ne._Instance.CurrLevel >= 3 && Laya.View.open("Scene/SettleSharePanel.scene", !1)
                                        // })
                                    )
                                })))
                        }), e.delay)),
                    e.rank <= 3 ? (this.RankIcon.visible = !0, this.RankIcon.skin = "res/Icon/Rank/No" + e.rank + ".png", this.RankLabel.visible = !1) : (this.RankIcon.visible = !1, this.RankLabel.visible = !0, this.RankLabel.text = e.rank),
                    e.rank >= ne._Instance.PlayerRank ? (
                        this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png",
                        this.BadgeIcon.gray = !1,
                        this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1],
                        this.Icon.skin = e.head,
                        this.NameLabel.text = e.name,
                        this.ExpLabel.text = e.exp + ""
                    ) : (
                        this.BadgeIcon.skin = "res/Icon/Badge/Badge_01.png",
                        this.BadgeIcon.gray = !0,
                        this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1], //"???", 
                        this.Icon.skin = e.head, //"res/Icon/Head/noicon.png", 
                        this.NameLabel.text = e.name, //"???", 
                        this.ExpLabel.text = e.exp + "" //"???"
                    )
            }
        }
    }
    class re extends e.Scene.SkinShopPanelUI {
        constructor() {
            super(),
                this.SkinGoldData = [],
                this.SkinVideoData = [],
                this.IsLottery = !1,
                this.RandomIndex = 0,
                this.KuangIndex = 0,
                this.IsGold = !1
        }
        onAwake() {
            re._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn, this.GetDebrisBtn]),
                this.GoldSkinBtn.on(Laya.Event.CLICK, this, this.GoldSkin),
                this.VideoSkinBtn.on(Laya.Event.CLICK, this, this.VideoSkin),
                this.GetDebrisBtn.on(Laya.Event.CLICK, this, this.GetDebris),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Close),
                this.GoldSkin(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                Laya.timer.loop(2e3, this, this.HBBtnTween),
                L.BannerShowData[7] = !0,
                s.SetBtnBottom(this.SkipBtn, 240),
                L.CreateBannerAd("adunit-f494ab4604df0cb6"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 6
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ])
        }
        onEnable() {}
        GoldSkin() {
            n.PlaySound("click"),
                this.GoldSkinTP.visible || (this.SkinShopCutSet(!0, !1), this.GoldSkinSet())
        }
        VideoSkin() {
            n.PlaySound("click"),
                this.VideoSkinTP.visible || (this.TipsLabel1.visible = !1, this.TipsLabel2.visible = !1, this.SkinShopCutSet(!1, !0), this.VideoSkinSet())
        }
        GetDebris() {
            n.PlaySound("click"),
                this.IsLottery ? platform.getInstance().prompt("In the lottery...") : (
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM1(),
                        this.GetGetDebrisCallBack()
                    }, () => {
                        //n.PlayBGM1()
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                    }))
        }
        GetGetDebrisCallBack() {
            this.IsLottery = !0;
            let e = [];
            for (let t = 0; t < i.SkinData.length; t++) {
                let a = i.SkinData[t];
                2 != a && 3 != a && 4 != a && 8 != a && 9 != a && 10 != a && 17 != a && 18 != a && 19 != a || e.push(a)
            }
            let t = !0;
            t = !(e.length > 0) || Math.random() > .2,
                Laya.timer.frameLoop(5, this, this.RandomSkin, [t, e])
        }
        RandomSkin(e, t) {
            let a = o.GetDataRandom({
                    arry: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    range: 1
                })[0],
                s = 1;
            30 == this.RandomIndex && (e ? (s = i.SkinDebrisOrderData[i.SkinDebrisOrderIndex], a = this.GetRandomId(s)) : (s = o.GetDataRandom({
                arry: t,
                range: 1
            })[0], a = this.GetRandomId(s)));
            for (let e = 0; e < this.VideoSkinList.getChildAt(0).numChildren; e++) this.VideoSkinList.getChildAt(0).getChildAt(e).getChildByName("Kuang").visible = e == a;
            this.RandomIndex++,
                n.PlaySound("pfcj"),
                this.RandomIndex > 30 && (Laya.timer.clear(this, this.RandomSkin), this.RandomIndex = 0,
                    //console.log("随机出来id是：" + a), 
                    Laya.timer.frameLoop(10, this, this.KuangTween, [a, s, e]), c.SendMsgToServer([{
                            key: "scene",
                            value: 6
                        },
                        {
                            key: "event_code",
                            value: 3
                        },
                        {
                            key: "event_code_sub",
                            value: 3
                        },
                        {
                            key: "skin_id",
                            value: s
                        }
                    ]))
        }
        KuangTween(e, t, a) {
            this.KuangIndex++,
                this.KuangIndex % 2 == 0 ? this.VideoSkinList.getChildAt(0).getChildAt(e).getChildByName("Kuang").visible = !0 : this.VideoSkinList.getChildAt(0).getChildAt(e).getChildByName("Kuang").visible = !1,
                this.KuangIndex >= 6 && (Laya.timer.clear(this, this.KuangTween), Laya.timer.once(300, this, () => {
                    this.IsLottery = !1,
                        this.KuangIndex = 0,
                        Laya.View.open("Scene/GetAwardPanel.scene", !1, ["SkinShop", t, a])
                }))
        }
        GetRandomId(e) {
            switch (e) {
                case 2:
                    return 0;
                case 3:
                    return 1;
                case 4:
                    return 2;
                case 8:
                    return 3;
                case 9:
                    return 4;
                case 10:
                    return 5;
                case 17:
                    return 6;
                case 18:
                    return 7;
                case 19:
                    return 8
            }
        }
        SkinShopCutSet(e, t) {
            this.GoldSkinTP.visible = e,
                this.GoldSkinBtn.visible = t,
                this.VideoSkinTP.visible = t,
                this.VideoSkinBtn.visible = e,
                this.GoldSkinList.visible = e,
                this.VideoSkinList.visible = t,
                this.GetDebrisBtn.visible = t,
                this.SkinBg.height = e ? 850 : 770
        }
        Close() {
            n.PlaySound("click"),
                this.IsGold || Laya.View.open("Scene/StartPanel.scene")
        }
        GoldSkinSet() {
            this.GoldSkinList.itemRender = le,
                this.GoldSkinList.vScrollBarSkin = null,
                this.SkinGoldData = o.arrayRepeat(i.SkinData, i.SkinShopData),
                this.GoldSkinList.array = this.SkinGoldData,
                this.SkinGoldData.length <= 0 ? (this.TipsLabel1.visible = !0, this.TipsLabel2.visible = !0) : (this.TipsLabel1.visible = !1, this.TipsLabel2.visible = !1),
                this.GoldSkinList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.SkinGoldData[t])
        }
        VideoSkinSet() {
            this.VideoSkinList.itemRender = he,
                this.SkinVideoData = i.SkinDebrisData,
                this.VideoSkinList.array = this.SkinVideoData,
                this.VideoSkinList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1)
        }
        freshList2(e, t) {
            e.setShow(this.SkinVideoData[t])
        }
        HBBtnTween() {
            Laya.Tween.to(this.HBTP, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.HBBtnTween1))
        }
        HBBtnTween1() {
            Laya.Tween.to(this.HBTP, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null, Laya.Handler.create(this, this.HBBtnTween2))
        }
        HBBtnTween2() {
            Laya.Tween.to(this.HBTP, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                100, null, Laya.Handler.create(this, this.HBBtnTween3))
        }
        HBBtnTween3() {
            Laya.Tween.to(this.HBTP, {
                    scaleX: 1,
                    scaleY: 1
                },
                100, null)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[7] = !1,
                L.SkinShopBanner && L.SkinShopBanner.hide()
        }
    }
    class le extends e.Scene.SkinGoldItemUI {
        constructor() {
            super(),
                this.istween = !1
            this.isOpenAward = false
        }
        onAwake() {
            s.AddBtnAnimation([this.BuyBtn])
        }
        setShow(e) {
            e && (
                this.SkinIcon.skin = "res/Icon/Skin/Skin" + e.skinid + ".png",
                this.SkinNameLabel.text = i.AniamlNameData[e.skinid - 1],
                this.GoldLabel.text = e.gold + "",
                this.BuyBtn.on(Laya.Event.CLICK, this, this.Buy, [e]),
                5 == e.skinid ?
                (
                    this.jbbg.visible = !1,
                    this.jbtp.visible = !1,
                    this.GoldLabel.visible = !1,
                    this.videotp.visible = !0,
                    this.gmtp.pos(90, 27.5)
                ) : (
                    this.jbbg.visible = !0,
                    this.jbtp.visible = !0,
                    this.GoldLabel.visible = !0,
                    this.videotp.visible = !1,
                    this.gmtp.pos(68.5, 27.5)
                )
            )
        }
        Buy(e) {
            n.PlaySound("click");
            if (this.isOpenAward) return;
            5 != e.skinid ?
                i.Gold >= e.gold ?
                (
                    N._Instance.UpdateGold(-e.gold),
                    N._Instance.UnLockSkin(e.skinid),
                    re._Instance.GoldSkinSet(),
                    Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Skin", e.skinid, 0, 0])
                ) : (
                    platform.getInstance().prompt("Lack of gold！", 500),
                    re._Instance.IsGold = !0,
                    this.isOpenAward = true,
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false;
                            let t = 300;
                            t = e.gold >= 3e3 ? 500 : 300,
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetGold", t])
                        }
                    }),
                    Laya.timer.once(700, this, () => {
                        re._Instance.IsGold = !1
                    })
                ) : (
                    Laya.SoundManager.stopMusic(),
                    platform.getInstance().showReward(() => {
                        N._Instance.UnLockSkin(e.skinid),
                            re._Instance.GoldSkinSet(),
                            Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Skin", e.skinid, 0, 0])
                    }, () => {
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                    })
                )
        }
    }
    class he extends e.Scene.SkinVideoItemUI {
        constructor() {
            super(),
                this.istween = !1
        }
        setShow(e) {
            if (e) {
                if (e.debrisnum >= 5) this.SkinIcon.skin = "res/Icon/Skin/Skin" + e.skinid + ".png",
                    this.yhdtp.visible = !0,
                    this.sptp.visible = !1,
                    this.NeiQuan.visible = !1;
                else {
                    this.NeiQuan.skin = "res/Icon/SkinDebrisHide/Skin" + e.skinid + ".png",
                        this.SkinIcon.skin = "res/Icon/Skin/Skin" + e.skinid + ".png",
                        this.NeiQuan.visible = !0,
                        this.yhdtp.visible = !1,
                        this.sptp.visible = !0,
                        this.spjdtp.width = 42 * e.debrisnum,
                        this.splabel.text = e.debrisnum + "/5",
                        this.NeiQuan.mask = null,
                        this.FXZZ = new Laya.Sprite,
                        this.FXZZ.pos(110.5, 121),
                        this.NeiQuan.mask = this.FXZZ;
                    let t = 48.4 * e.debrisnum - 121;
                    this.FXZZ.graphics.drawRect(-110.5, t, 221, 242, "#ffffff")
                }
                this.SkinNameLabel.text = i.AniamlNameData[e.skinid - 1]
            }
        }
    }
    class ce extends e.Scene.LotteryPanelUI {
        constructor() {
            super(),
                this.IsLottery = !1,
                this.IsMF = !1,
                this.IsVideo = !0,
                this.skindata = [26, 27, 19],
                this.DengIndex = 0,
                this.DoubleBoxNum = 1
        }
        onAwake() {
            ce._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.GetAwardBtn, this.SkipBtn]),
                this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAward),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                1 == i.IsMFLottery ? this.IsMF = !1 : this.IsMF = !0,
                this.IsVideo = !0,
                this.videotp.visible = !0,
                this.cjtp.visible = !0,
                this.mfcjtp.visible = !1,
                this.DengTP1.visible = !0,
                this.DengTP2.visible = !1,
                this.RefreshBtn(),
                this.RefreshUI(),
                Laya.timer.frameLoop(8, this, this.AlterDeng),
                L.BannerShowData[4] = !0,
                s.SetBtnBottom(this.BottomBox, 280),
                L.CreateBannerAd("adunit-dbbf28f2c1bd0615"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 4
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ])
        }
        onEnable() {}
        RefreshBtn() {
            1 == i.IsMFLottery ? this.IsMF = !1 : this.IsMF = !0,
                this.IsMF ? (this.cjtp.visible = !1, this.videotp.visible = !1, this.mfcjtp.visible = !0) : (this.IsVideo = !0, this.cjtp.visible = !0, this.videotp.visible = !0, this.mfcjtp.visible = !1)
        }
        PlayEffect() {
            if (i.LotteryIndex < 6) {
                let e = new Laya.Skeleton;
                switch (i.LotteryIndex) {
                    case 1:
                        this.ErBox.addChild(e);
                        break;
                    case 2:
                        this.SiBox.addChild(e);
                        break;
                    case 3:
                        this.WuBox.addChild(e);
                        break;
                    case 4:
                        this.LiuBox.addChild(e);
                        break;
                    case 5:
                        this.SanBox.addChild(e)
                }
                e.pos(46.5, 72),
                    e.scale(.5, .5),
                    e.load("res/UIEffect/YanWu/yanwu.sk", new Laya.Handler(this, () => {
                            e.play(0, !1)
                        },
                        null, !0)),
                    Laya.timer.once(300, this, this.RefreshUI),
                    Laya.timer.once(1e3, this, () => {
                        this.IsLottery = !1,
                            e.removeSelf()
                    }),
                    1 == i.LotteryIndex ? this.TipsLabel.text = "Draw once more you will 100% get the skin" : this.TipsLabel.text = "The rewards become better",
                    this.TipsLabel.scale(0, 0),
                    Laya.Tween.to(this.TipsLabel, {
                            scaleX: 1,
                            scaleY: 1
                        },
                        300, Laya.Ease.backOut)
            } else this.IsLottery = !1,
                this.RefreshUI();
            i.LotteryIndex++,
                r.save_int("LotteryIndex", i.LotteryIndex),
                i.LotteryIndexTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400,
                r.save_int("LotteryIndexTimeStamp", i.LotteryIndexTimeStamp)
        }
        RefreshUI() {
            if (1 == i.IsLotterySkin)
                if (1 == i.IsTowDay && i.LotteryIndex <= 2) this.PFTP.visible = !1,
                    this.SPTP.visible = !0,
                    this.SPTP.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png";
                else {
                    let e = [];
                    for (let t = 0; t < i.SkinData.length; t++) 26 != i.SkinData[t] && 27 != i.SkinData[t] && 19 != i.SkinData[t] || e.push(i.SkinData[t]);
                    let t = o.GetArrDifference(this.skindata, e);
                    this.SPTP.visible = !1,
                        this.PFTP.visible = !0,
                        this.PFTP.skin = "res/Icon/Skin/Skin" + t[0] + ".png"
                }
            else this.SPTP.visible = !1,
                this.PFTP.visible = !0,
                this.PFTP.skin = "res/Icon/Skin/Skin11.png";
            switch (i.LotteryIndex) {
                case 1:
                    this.ErBox.getChildAt(0).visible = !0,
                        this.ErBox.getChildAt(0).pos(28, 48),
                        this.ErBox.getChildAt(1).pos(67, 45),
                        this.ErBox.getChildAt(2).getChildAt(0).value = "x200",
                        this.ErBox.getChildAt(3).getChildAt(0).value = "x50",
                        this.ErBox.getChildAt(4).visible = !1,
                        this.SanBox.getChildAt(2).visible = !1,
                        this.SanBox.getChildAt(3).visible = !1,
                        this.SanBox.getChildAt(4).value = "x5",
                        this.WuBox.getChildAt(1).value = "x500",
                        this.LiuBox.getChildAt(1).value = "x100";
                    break;
                case 2:
                    this.ErBox.getChildAt(0).visible = !1,
                        this.ErBox.getChildAt(1).pos(46.5, 45),
                        this.ErBox.getChildAt(2).visible = !1,
                        this.ErBox.getChildAt(3).visible = !1,
                        this.ErBox.getChildAt(4).value = "x500",
                        this.ErBox.getChildAt(4).visible = !0,
                        this.SanBox.getChildAt(2).visible = !1,
                        this.SanBox.getChildAt(3).visible = !1,
                        this.SanBox.getChildAt(4).value = "x5",
                        this.WuBox.getChildAt(1).value = "x500",
                        this.LiuBox.getChildAt(1).value = "x100";
                    break;
                case 3:
                    this.ErBox.getChildAt(2).visible = !1,
                        this.ErBox.getChildAt(3).visible = !1,
                        this.ErBox.getChildAt(4).value = "x500",
                        this.SanBox.getChildAt(2).visible = !1,
                        this.SanBox.getChildAt(3).visible = !1,
                        this.SanBox.getChildAt(4).value = "x5",
                        this.WuBox.getChildAt(1).value = "x500",
                        this.LiuBox.getChildAt(1).value = "x100";
                    break;
                case 4:
                    this.ErBox.getChildAt(2).visible = !1,
                        this.ErBox.getChildAt(3).visible = !1,
                        this.ErBox.getChildAt(4).value = "x500",
                        this.SanBox.getChildAt(2).visible = !1,
                        this.SanBox.getChildAt(3).visible = !1,
                        this.SanBox.getChildAt(4).value = "x5",
                        this.WuBox.getChildAt(1).value = "x1000",
                        this.LiuBox.getChildAt(1).value = "x100";
                    break;
                case 5:
                    this.ErBox.getChildAt(2).visible = !1,
                        this.ErBox.getChildAt(3).visible = !1,
                        this.ErBox.getChildAt(4).value = "x500",
                        this.SanBox.getChildAt(2).visible = !1,
                        this.SanBox.getChildAt(3).visible = !1,
                        this.SanBox.getChildAt(4).value = "x5",
                        this.WuBox.getChildAt(1).value = "x1000",
                        this.LiuBox.getChildAt(1).value = "x1000";
                    break;
                case 6:
                    this.ErBox.getChildAt(2).visible = !1,
                        this.ErBox.getChildAt(3).visible = !1,
                        this.ErBox.getChildAt(4).value = "x500",
                        this.SanBox.getChildAt(0).visible = !0,
                        this.SanBox.getChildAt(1).pos(78, 52),
                        this.SanBox.getChildAt(2).getChildAt(0).value = "x100",
                        this.SanBox.getChildAt(3).getChildAt(0).value = "x5",
                        this.SanBox.getChildAt(4).visible = !1,
                        this.SanBox.getChildAt(2).visible = !0,
                        this.SanBox.getChildAt(3).visible = !0,
                        this.WuBox.getChildAt(1).value = "x1000",
                        this.LiuBox.getChildAt(1).value = "x1000"
            }
            i.LotteryIndex >= 7 && (this.ErBox.getChildAt(2).visible = !1, this.ErBox.getChildAt(3).visible = !1, this.ErBox.getChildAt(4).value = "x500", this.SanBox.getChildAt(0).visible = !0, this.SanBox.getChildAt(1).pos(78, 52), this.SanBox.getChildAt(2).getChildAt(0).value = "x100", this.SanBox.getChildAt(3).getChildAt(0).value = "x5", this.SanBox.getChildAt(4).visible = !1, this.SanBox.getChildAt(2).visible = !0, this.SanBox.getChildAt(3).visible = !0, this.WuBox.getChildAt(1).value = "x1000", this.LiuBox.getChildAt(1).value = "x1000")
        }
        GetAward() {
            n.PlaySound("click"),
                this.IsLottery ? (platform.getInstance().prompt("In the lottery..."), platform.getInstance().prompt("In the lottery...")) : (Laya.Tween.to(this.TipsLabel, {
                            scaleX: 0,
                            scaleY: 0
                        },
                        300, Laya.Ease.backIn),
                    this.IsMF ? (
                        i.IsMFLottery = 1,
                        r.save_int("IsMFLottery", i.IsMFLottery),
                        i.MFLotteryTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400,
                        r.save_int("MFLotteryTimeStamp", i.MFLotteryTimeStamp),
                        this.GetAwardCallBack()
                    ) : this.IsVideo ? (
                        Laya.SoundManager.stopMusic(),
                        platform.getInstance().showReward(() => {
                            //n.PlayBGM1(),
                            this.GetAwardCallBack()
                        }, () => {
                            //n.PlayBGM1()
                            platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.");
                        })
                    ) : i.Gold >= 100 ? (c.SendMsgToServer([{
                            key: "scene",
                            value: 4
                        },
                        {
                            key: "event_code",
                            value: 2
                        }
                    ]), N._Instance.UpdateGold(-100), this.GetAwardCallBack()) : (c.SendMsgToServer([{
                                key: "scene",
                                value: 0
                            },
                            {
                                key: "event_code",
                                value: 8
                            }
                        ]),
                        platform.getInstance().prompt("gold is not enough！", 500),
                        platform.getInstance().prompt("gold is not enough！", 500),
                        Laya.timer.once(500, this, () => {
                            Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetGold"])
                        })))
        }
        GetAwardCallBack() {
            n.PlaySound("Luck"),
                this.Refresh(),
                this.IsLottery = !0;
            let e = 1,
                t = [],
                a = [],
                s = Math.random();
            if (i.LotteryIndex <= 6) switch (i.LotteryIndex) {
                case 1:
                    e = 2,
                        t = [1, 4],
                        a = [200, 50];
                    break;
                case 2:
                    1 == i.IsLotterySkin ? (e = 7, t = [3], a = [1]) : (e = 3, t = [6], a = [1]);
                    break;
                case 3:
                    e = 4,
                        t = [5],
                        a = [500];
                    break;
                case 4:
                    e = 6,
                        t = [1],
                        a = [100];
                    break;
                case 5:
                    e = 1,
                        t = [2],
                        a = [5];
                    break;
                case 6:
                    e = 5,
                        t = [1, 4],
                        a = [200, 100]
            } else s <= .86 ? (e = 1, t = [1, 2], a = [100, 5]) : s > .86 && s <= .97 ? (e = 5, t = [1, 4], a = [200, 100]) : s > .97 && s <= .98 ? (e = 2, t = [4], a = [500]) : s > .98 && s <= .99 ? (e = 4, t = [5], a = [1e3]) : s > .99 && (e = 6, t = [1], a = [1e3]);
            Laya.Tween.to(this.ZhuanPan, {
                    rotation: this.GetZhuanPanRot(e)
                },
                6e3, Laya.Ease.cubicOut, Laya.Handler.create(this, () => {
                    Laya.SoundManager.stopSound("GameScene/Sound/Luck.mp3"),
                        Laya.timer.once(300, this, () => {
                            Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Lottery", t, a])
                        })
                }))
        }
        Skip() {
            n.PlaySound("click"),
                this.IsLottery ? (platform.getInstance().prompt("In the lottery..."), platform.getInstance().prompt("In the lottery...")) : Laya.View.open("Scene/StartPanel.scene")
        }
        Refresh() {
            this.ZhuanPan.rotation = 0
        }
        AlterDeng() {
            this.DengIndex++,
                this.DengIndex % 2 == 0 ? (this.DengTP2.visible = !0, this.DengTP1.visible = !1) : (this.DengTP2.visible = !1, this.DengTP1.visible = !0)
        }
        GetZhuanPanRot(e) {
            let t = 1800,
                a = 0;
            switch (e) {
                case 1:
                    a = 40 * Math.random() + 10,
                        this.DoubleBoxNum = 6;
                    break;
                case 2:
                    a = 40 * Math.random() + 250,
                        this.DoubleBoxNum = 2;
                    break;
                case 3:
                case 7:
                    a = 40 * Math.random() + 190,
                        this.DoubleBoxNum = 3;
                    break;
                case 4:
                    a = 40 * Math.random() + 130,
                        this.DoubleBoxNum = 4;
                    break;
                case 5:
                    a = 40 * Math.random() + 310,
                        this.DoubleBoxNum = 1;
                    break;
                case 6:
                    a = 40 * Math.random() + 70,
                        this.DoubleBoxNum = 5
            }
            return t += a
        }
        onDisable() {
            Laya.timer.clearAll(this),
                z._Instance.PlayerActiveCtrl(!0),
                L.BannerShowData[4] = !1,
                L.LotteryBanner && L.LotteryBanner.hide()
        }
    }
    class de extends e.Scene.SkinPanelUI {
        constructor() {
            super(),
                this.SkinData = [],
                this.SkinColorData = [],
                this.DowerData = [],
                this.UpLvType = 1,
                this.CurrentXZSkinIndex = 0,
                this.DowerTipsIndex = 0
        }
        onAwake() {
            de._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.UserBtn, this.SkipBtn, this.LeftBtn, this.RightBtn, this.VideoLvBackBtn, this.VideoLvBtn]),
                this.UserBtn.on(Laya.Event.CLICK, this, this.User),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Close),
                this.LeftBtn.on(Laya.Event.CLICK, this, this.Left),
                this.RightBtn.on(Laya.Event.CLICK, this, this.Right),
                this.VideoLvBtn.on(Laya.Event.CLICK, this, this.VideoLv),
                this.VideoLvBackBtn.on(Laya.Event.CLICK, this, this.VideoLvBack),
                this.SkinData = i.SkinData,
                Laya.timer.frameLoop(1, this, this.Update),
                this.CreateScene3D(),
                this.Refresh(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[6] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-139fc91faf13e7ff"),
                i.IsNewSkin = !1,
                c.SendMsgToServer([{
                        key: "scene",
                        value: 5
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ]),
                this.OpenDowerIcon(),
                this.LeftBtnTween(),
                this.RightBtnTween()
        }
        OpenDowerIcon() {
            let e = "Upgrade the skills to become more powerful~";
            e = this.DowerTipsIndex % 2 == 0 ? "Upgrade the skills to become more powerful~" : "Upgrade the skills can help me win!",
                this.DowerTipsIndex++,
                this.DowerLabel.text = e,
                Laya.Tween.to(this.DowerTP, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    500, Laya.Ease.backOut),
                Laya.timer.once(5e3, this, this.CloseDowerIcon)
        }
        CloseDowerIcon() {
            Laya.Tween.to(this.DowerTP, {
                        scaleX: 0,
                        scaleY: 0
                    },
                    500, Laya.Ease.backIn),
                Laya.timer.once(2e3, this, this.OpenDowerIcon)
        }
        CreateScene3D() {
            this.Scene3D = Laya.stage.addChild(new Laya.Scene3D),
                this.Camera = this.Scene3D.addChild(new Laya.Camera),
                this.Camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY,
                this.Camera.transform.position = new Laya.Vector3(0, 8, 8),
                this.Camera.transform.rotationEuler = new Laya.Vector3(-45, 0, 0),
                this.DirectionalLight = this.Scene3D.addChild(new Laya.DirectionLight),
                this.DirectionalLight.transform.position = new Laya.Vector3(0, 0, 0),
                this.DirectionalLight.transform.rotationEuler = new Laya.Vector3(-66, 15, 0),
                this.DirectionalLight.color = new Laya.Vector3(.8392157, .9667342, 1),
                this.DirectionalLight.intensity = .8,
                this.SkinBox = this.Scene3D.addChild(new Laya.Sprite3D),
                this.SkinBox.transform.position = new Laya.Vector3(0, 0, 0);
            for (let e = 0; e < this.SkinData.length; e++) {
                let t = this.SkinBox.addChild(p.SelectMonster(i.AniamlResNameData[this.SkinData[e] - 1])),
                    a = 1.7773333333333334 / (Laya.stage.height / Laya.stage.width);
                switch (t.getChildAt(0).transform.scale = new Laya.Vector3(a, a, a), t.getChildAt(1).transform.scale = new Laya.Vector3(a, a, a), t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1.2 * a, 0), t.transform.localRotationEuler = new Laya.Vector3(-12, -10, 0), this.SkinData[e]) {
                    case 1:
                        let i = 1.7773333333333334 / (Laya.stage.height / Laya.stage.width);
                        t.getChildAt(0).transform.scale = new Laya.Vector3(i, i, i),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(i, i, i);
                        break;
                    case 2:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1.5 * a, 0);
                        break;
                    case 3:
                        t.getChildAt(0).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a),
                            t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 4:
                        t.getChildAt(0).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1 * a, 0);
                        break;
                    case 5:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.1 * a, 0);
                        break;
                    case 6:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.4 * a, 0);
                        break;
                    case 7:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 8:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.05 + 10 * e), 1.2 * a, 0);
                        break;
                    case 9:
                        t.getChildAt(0).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 10:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (10 * e - .05), 1 * a, 0);
                        break;
                    case 11:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.3 * a, 0),
                            t.transform.localRotationEuler = new Laya.Vector3(12, -190, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.75 * a, .75 * a, .75 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.75 * a, .75 * a, .75 * a);
                        break;
                    case 12:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (10 * e - .05), 1.2 * a, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.95 * a, .95 * a, .95 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.95 * a, .95 * a, .95 * a);
                        break;
                    case 13:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 14:
                        t.getChildAt(0).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a),
                            t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1.3 * a, 0);
                        break;
                    case 15:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1.1 * a, 0);
                        break;
                    case 16:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 17:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.2 * a, 0);
                        break;
                    case 18:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 19:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (10 * e - .05), 1.2 * a, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a);
                        break;
                    case 20:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.3 * a, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.95 * a, .95 * a, .95 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.95 * a, .95 * a, .95 * a);
                        break;
                    case 21:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (10 * e - .05), .9 * a, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.8 * a, .8 * a, .8 * a);
                        break;
                    case 22:
                        t.transform.localRotationEuler = new Laya.Vector3(12, -190, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.9 * a, .9 * a, .9 * a),
                            t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1.2 * a, 0);
                        break;
                    case 23:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.15 + 10 * e), 1.6 * a, 0),
                            t.getChildAt(0).transform.scale = new Laya.Vector3(.85 * a, .85 * a, .85 * a),
                            t.getChildAt(1).transform.scale = new Laya.Vector3(.85 * a, .85 * a, .85 * a);
                        break;
                    case 24:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + 10 * e, 1 * a, 0);
                        break;
                    case 26:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (10 * e - .05), 1 * a, 0);
                        break;
                    case 27:
                        t.transform.localPosition = new Laya.Vector3(-1.5 * a + (.1 + 10 * e), 1.1 * a, 0)
                }
            }
        }
        onEnable() {}
        Update() {
            this.CurrentXZSkinIndex <= 0 ? this.LeftBtn.visible = !1 : this.LeftBtn.visible = !0,
                this.CurrentXZSkinIndex >= this.SkinData.length - 1 ? this.RightBtn.visible = !1 : this.RightBtn.visible = !0,
                this.SkinNameLabel.text = i.AniamlNameData[this.SkinData[this.CurrentXZSkinIndex] - 1],
                this.SkinData[this.CurrentXZSkinIndex] == i.SkinId ? (this.YSZTP.visible = !0, this.UserBtn.gray = !0) : (this.YSZTP.visible = !1, this.UserBtn.gray = !1)
        }
        Refresh() {
            this.DowerBox.visible = !0,
                this.DowerSet();
            for (let e = 0; e < this.SkinData.length; e++)
                if (this.SkinData[e] == i.SkinId) {
                    this.SkinBox.transform.translate(new Laya.Vector3(-10 * e, 0, 0), !1),
                        this.CurrentXZSkinIndex = e;
                    break
                }
            this.SkinColorSet()
        }
        User() {
            n.PlaySound("click"),
                this.SkinData[this.CurrentXZSkinIndex] == i.SkinId ? (platform.getInstance().prompt("The role has been filled!"), platform.getInstance().prompt("The role has been filled!")) : (
                    //console.log("切换的皮肤id是：" + this.SkinData[this.CurrentXZSkinIndex]), 
                    N._Instance.AlterSkin(this.SkinData[this.CurrentXZSkinIndex]), this.SkinColorSet(), c.SendMsgToServer([{
                            key: "scene",
                            value: 5
                        },
                        {
                            key: "event_code",
                            value: 2
                        },
                        {
                            key: "skin_id",
                            value: this.SkinData[this.CurrentXZSkinIndex]
                        }
                    ]))
        }
        Left() {
            n.PlaySound("click"),
                this.CurrentXZSkinIndex--,
                this.SkinBox.transform.translate(new Laya.Vector3(10, 0, 0), !1),
                this.SkinColorSet()
        }
        Right() {
            n.PlaySound("click"),
                this.CurrentXZSkinIndex++,
                this.SkinBox.transform.translate(new Laya.Vector3(-10, 0, 0), !1),
                this.SkinColorSet()
        }
        VideoLv() {
            n.PlaySound("click"),
                Laya.SoundManager.stopMusic(),
                platform.getInstance().showReward(() => {
                    //n.PlayBGM1(),
                    platform.getInstance().prompt("Upgrade Successfully!"),
                        N._Instance.UpdateDowerLv(this.UpLvType),
                        this.DowerSet(),
                        this.VideoLvBox.visible = !1,
                        this.DowerBox.visible = !0;
                    //console.log("升级下标:", this.CurrentXZSkinIndex);
                    let e = this.SkinBox.getChildAt(this.CurrentXZSkinIndex).addChild(D._Instance.effect_dowerlveffect);
                    e.transform.localPosition = new Laya.Vector3(-.05, 0, 0),
                        Laya.timer.once(1e3, this, () => {
                            D._Instance.recover(D.Name_EffectDowerLveffect, e)
                        })
                }, () => {
                    //n.PlayBGM1();
                    platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.");
                })
        }
        GetDowerLv(e) {
            for (let t = 0; t < i.DowerData.length; t++)
                if (i.DowerData[t].dowertype == e) {
                    return i.DowerData[t].dowerlv + 1
                }
        }
        VideoLvBack() {
            n.PlaySound("click"),
                this.VideoLvBox.visible = !1,
                this.DowerBox.visible = !0
        }
        Close() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        DowerSet() {
            console.log(i.DowerData),
                this.DowerData = i.DowerData,
                this.DowerList.itemRender = pe,
                this.DowerList.array = this.DowerData,
                this.DowerList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.DowerData[t])
        }
        SkinColorSet() {
            this.SkinColorList.itemRender = me,
                this.SkinColorList.hScrollBarSkin = null;
            for (let e = 0; e < i.SkinColorData.length; e++)
                if (i.SkinColorData[e].skinid == this.SkinData[this.CurrentXZSkinIndex]) {
                    this.SkinColorData = i.SkinColorData[e].skincolordata;
                    break
                }
            this.SkinColorList.array = this.SkinColorData,
                this.SkinColorList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1);
            for (let e = 0; e < this.SkinColorData.length; e++)
                if (1 == this.SkinColorData[e].isuser) {
                    this.SkinColorData[e].skinid == i.SkinId && N._Instance.AlterColorSkin(this.SkinColorData[e].skinid, this.SkinColorData[e].colorid, !0),
                        this.AlterColorSkin(this.SkinData[this.CurrentXZSkinIndex], this.SkinColorData[e].colorid);
                    break
                }
        }
        freshList2(e, t) {
            e.setShow(this.SkinColorData[t])
        }
        AlterColorSkin(e, t) {
            for (let a = 0; a < this.SkinData.length; a++)
                if (this.SkinData[a] == e) {
                    for (let e = 0; e < this.SkinBox.numChildren; e++)
                        if (a == e) {
                            this.SkinBox.getChildAt(e).getChildAt(0).meshRenderer.material = i.AniamlMatResData[t - 1];
                            break
                        }
                    break
                }
        }
        LeftBtnTween() {
            Laya.Tween.to(this.LeftBtn, {
                    x: 30
                },
                1e3, null, Laya.Handler.create(this, this.LeftBtnTween1))
        }
        LeftBtnTween1() {
            Laya.Tween.to(this.LeftBtn, {
                    x: 40
                },
                1e3, null, Laya.Handler.create(this, this.LeftBtnTween))
        }
        RightBtnTween() {
            Laya.Tween.to(this.RightBtn, {
                    x: 335
                },
                1e3, null, Laya.Handler.create(this, this.RightBtnTween1))
        }
        RightBtnTween1() {
            Laya.Tween.to(this.RightBtn, {
                    x: 325
                },
                1e3, null, Laya.Handler.create(this, this.RightBtnTween))
        }
        onDisable() {
            Laya.timer.clearAll(this),
                z._Instance.PlayerActiveCtrl(!0),
                this.Scene3D && this.Scene3D.destroy(),
                L.BannerShowData[6] = !1,
                L.SkinBanner && L.SkinBanner.hide()
        }
    }
    class pe extends e.Scene.DowerItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this.UpLvBtn])
        }
        setShow(e) {
            if (e) {
                switch (e.dowertype) {
                    case 1:
                        this.TipsLabel.text = "Tail Length+" + e.dowerlv;
                        break;
                    case 2:
                        this.TipsLabel.text = "Move Speed+" + 5 * e.dowerlv + "%";
                        break;
                    case 3:
                        0 == e.dowerlv ?
                            this.TipsLabel.text = "Init Volume+0%" :
                            this.TipsLabel.text = "Init Volume+" + (5 + 5 * e.dowerlv) + "%"
                }
                e.dowerlv >= 9 ? (this.sjtp.visible = !1, this.ymjtp.visible = !0, this.UpLvBtn.gray = !0, this.DiamondLabel.visible = !1, this.zstp.visible = !1) : (this.sjtp.visible = !0, this.ymjtp.visible = !1, this.UpLvBtn.gray = !1, this.DiamondLabel.visible = !0, this.DiamondLabel.text = "-" + e.diamonddata[e.dowerlv], this.zstp.visible = !0),
                    this.UpLvBtn.on(Laya.Event.CLICK, this, this.UpLv, [e])
            }
            this.TipsLabel.fontSize = 20;
        }
        UpLv(e) {
            if (n.PlaySound("click"), e.dowerlv >= 9) platform.getInstance().prompt("This skill is full!");
            else if (i.Diamond >= e.diamonddata[e.dowerlv]) {
                c.SendMsgToServer([{
                            key: "scene",
                            value: 5
                        },
                        {
                            key: "event_code",
                            value: 4
                        },
                        {
                            key: "talent_type",
                            value: e.dowertype
                        },
                        {
                            key: "u_lev",
                            value: de._Instance.GetDowerLv(e.dowertype)
                        }
                    ]),
                    N._Instance.UpdateDiamond(-e.diamonddata[e.dowerlv]),
                    platform.getInstance().prompt("Level up!"),
                    N._Instance.UpdateDowerLv(e.dowertype),
                    de._Instance.DowerSet();
                //console.log("升级下标:", de._Instance.CurrentXZSkinIndex);
                let t = de._Instance.SkinBox.getChildAt(de._Instance.CurrentXZSkinIndex).addChild(D._Instance.effect_dowerlveffect);
                t.transform.localPosition = new Laya.Vector3(-.05, 0, 0),
                    Laya.timer.once(1e3, this, () => {
                        D._Instance.recover(D.Name_EffectDowerLveffect, t)
                    })
            } else if (e.diamonddata[e.dowerlv] - i.Diamond <= 100) {
                switch (
                    platform.getInstance().prompt("Diamond is not enough！"), de._Instance.UpLvType = e.dowertype, de._Instance.DowerBox.visible = !1, e.dowertype) {
                    case 1:
                        de._Instance.CurrlvLabel.text = "Tail Length:+" + e.dowerlv,
                            de._Instance.NextlvLabel.text = "+" + (e.dowerlv + 1);
                        break;
                    case 2:
                        de._Instance.CurrlvLabel.text = "Move Speed:+" + 5 * e.dowerlv + "%",
                            de._Instance.NextlvLabel.text = "+" + 5 * (e.dowerlv + 1) + "%";
                        break;
                    case 3:
                        0 == e.dowerlv ?
                            (de._Instance.CurrlvLabel.text = "Init Volume:+0%", de._Instance.NextlvLabel.text = "+10%") :
                            (de._Instance.CurrlvLabel.text = "Init Volume:+" + (5 + 5 * e.dowerlv) + "%",
                                de._Instance.NextlvLabel.text = "+" + (5 + 5 * (e.dowerlv + 1)) + "%")
                }
                de._Instance.VideoLvBox.visible = !0,
                    Laya.Tween.clearAll(de._Instance.VideoLvBox),
                    de._Instance.VideoLvBox.scale(0, 0),
                    Laya.Tween.to(de._Instance.VideoLvBox, {
                            scaleX: 1,
                            scaleY: 1
                        },
                        300, Laya.Ease.backOut),
                    de._Instance.VideoLvBackBtn.visible = !1,
                    1 == i.BannerSwitch ? Laya.timer.once(3e3, this, () => {
                        de._Instance.VideoLvBackBtn.visible = !0
                    }) : de._Instance.VideoLvBackBtn.visible = !0
            } else platform.getInstance().prompt("Diamond is not enough！", 500),
                Laya.timer.once(500, this, () => {
                    de._Instance.SkinBox.active = !1,
                        Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetDiamond", 1])
                })
            de._Instance.CurrlvLabel.fontSize = 20;
            de._Instance.NextlvLabel.fontSize = 20;
        }
    }
    class me extends e.Scene.SkinColorItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this.ColorIcon])
        }
        setShow(e) {
            e && (1 == e.colorid ? this.ColorIcon.skin = "res/Icon/SkinColor/Color" + this.getSkinColor(e.skinid) + ".png" : this.ColorIcon.skin = "res/Icon/SkinColor/Color" + e.colorid + ".png", 1 == e.islock ? (this.VideoTP.visible = !1, 1 == e.isuser ? this.UserTP.visible = !0 : this.UserTP.visible = !1) : (this.VideoTP.visible = !0, this.UserTP.visible = !1), this.ColorIcon.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                1 == e.islock ? (
                    e.skinid == i.SkinId ?
                    N._Instance.AlterColorSkin(e.skinid, e.colorid, !0) :
                    N._Instance.AlterColorSkin(e.skinid, e.colorid, !1),
                    de._Instance.SkinColorSet()
                ) : (Laya.SoundManager.stopMusic(),
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM1(),
                        N._Instance.UnLockColorSkin(e.skinid, e.colorid),
                            de._Instance.SkinColorSet()
                    }, () => {
                        //n.PlayBGM1()
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                    })
                )
        }
        getSkinColor(e) {
            switch (e) {
                case 20:
                case 6:
                case 12:
                    return "10";
                case 10:
                case 5:
                case 22:
                    return "11";
                case 18:
                case 19:
                case 26:
                case 11:
                    return "12";
                case 1:
                case 24:
                    return "13";
                case 2:
                case 3:
                case 21:
                    return "14";
                case 4:
                case 15:
                    return "15";
                case 13:
                case 23:
                    return "16";
                case 7:
                case 9:
                case 16:
                case 17:
                case 14:
                    return "17";
                case 27:
                    return "18";
                case 8:
                case 25:
                    return "19"
            }
        }
    }
    class ye extends e.Scene.GetAwardPanelUI {
        constructor() {
            super(),
                this.OpenType = "",
                this.AwardType = 1,
                this.AwardNum = 1,
                this.IsSP = !1,
                this.AwardTypeData = [],
                this.AwardData = [],
                this.IsDouble = 1,
                this.IsAni = !1,
                this.IsGetAward = !1,
                this.IsConutTimer = !1
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.TopUIMatch(this.TopBox, 0),
                s.AddBtnAnimation([this.SkipBtn, this.SkipBtn1, this.GetAwardBtn]),
                this.pivot(this.width / 2, this.height / 2),
                this.centerX = 0,
                this.centerY = 0,
                this.scale(0, 0),
                Laya.Tween.to(this, {
                        scaleX: 1,
                        scaleY: 1
                    },
                    300, Laya.Ease.backOut),
                this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAward),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.SkipBtn1.on(Laya.Event.CLICK, this, this.Skip),
                s.SetBtnBottom(this.GetAwardBtn, 370),
                this.PowerRefresh(),
                Laya.timer.frameLoop(1, this, this.Update),
                n.PlaySound("getaward")
        }
        onOpened(e) {
            if (e) {
                let t = 300;
                switch (this.OpenType = e[0], this.AwardLabel.pos(60, 137), this.gxhdtp.visible = !0, e[0]) {
                    case "SettleGold":
                        this.AwardNum = i.MaxLevel,
                            this.Bg.alpha = 1,
                            Laya.SoundManager.stopMusic(),
                            this.TopBox.visible = !0,
                            this.jbtp.visible = !0,
                            this.AwardLabel.text = i.GetGold.toString(),
                            4 == this.AwardNum ? (
                                this.mfsblqtp.visible = !0,
                                this.SkipBtn.visible = !1
                            ) : (
                                this.sblqtp.visible = !0,
                                this.videotp.visible = !0,
                                1 == i.BannerSwitch ?
                                Laya.timer.once(3e3, this, () => {
                                    this.SkipBtn.visible = !0
                                }) : this.SkipBtn.visible = !0
                            ),
                            i.MaxLevel > 15 && i.StreakWinNum++,
                            i.StreakFallNum = 0,
                            N._Instance.UpdateLevel(),
                            1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                                this.SkipBtn.visible = !0
                            }) : this.SkipBtn.visible = !0;
                        break;
                    case "SettleLottery":
                        this.TopBox.visible = !0,
                            this.AwardNum = e[1],
                            this.Bg.alpha = 1,
                            this.jytp.visible = !0,
                            this.AwardLabel.text = "Expx" + (e[1] - 1) * ne._Instance.GetExp,
                            this.lqtp.visible = !0;
                        break;
                    case "Gift":
                        this.IsAni = !0,
                            this.AwardData = e[1],
                            this.Bg.alpha = 1,
                            this.TopBox.visible = !0;
                        let a = 0;
                        for (let e = 0; e < this.AwardData.length; e++) 0 != this.AwardData[e] && a++;
                        for (let e = 0; e < this.AwardData.length; e++)
                            if (0 == e && 0 != this.AwardData[e]) {
                                let i, s = 1.5;
                                switch (this.Box1.visible = !0, this.jbtp.visible = !0, this.AwardLabel.text = "x" + this.AwardData[e], this.Box1.pos(375, 351), this.Box1.scale(0, 0), a) {
                                    case 2:
                                        i = 260;
                                        break;
                                    case 3:
                                        i = 150;
                                        break;
                                    case 4:
                                        i = 150
                                        s = 1
                                }
                                Laya.Tween.to(this.Box1, {
                                            scaleX: s,
                                            scaleY: s
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box1, {
                                                    x: i
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (1 == e && 0 != this.AwardData[e]) {
                            let e, s = 1.5;
                            switch (this.Box3.visible = !0, this.sptp3.visible = !0, this.sptp3.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png", this.AwardLabel3.text = i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1", this.Box3.pos(375, 351), this.Box3.scale(0, 0), a) {
                                case 3:
                                    e = 375;
                                    break;
                                case 4:
                                    e = 300
                                    s = 1
                            }
                            Laya.Tween.to(this.Box3, {
                                        scaleX: s,
                                        scaleY: s
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box3, {
                                                x: e
                                            },
                                            200, null)
                                    }), t),
                                t += 300
                        } else if (2 == e && 0 != this.AwardData[e]) {
                            let e, s = 1.5;
                            switch (this.Box4.visible = !0, this.tltp4.visible = !0, this.AwardLabel4.text = "x5", this.Box4.pos(375, 351), this.Box4.scale(0, 0), a) {
                                case 3:
                                    e = 375;
                                    break;
                                case 4:
                                    e = 450
                                    s = 1
                            }
                            Laya.Tween.to(this.Box4, {
                                        scaleX: s,
                                        scaleY: s
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box4, {
                                                x: e
                                            },
                                            200, null)
                                    }), t),
                                t += 300
                        } else if (3 == e && 0 != this.AwardData[e]) {
                            let i, s = 1.5;
                            switch (this.Box5.visible = !0, this.zstp5.visible = !0, this.AwardLabel5.text = "x" + this.AwardData[e], this.Box5.pos(375, 351), this.Box5.scale(0, 0), a) {
                                case 2:
                                    i = 490;
                                    break;
                                case 3:
                                    i = 600;
                                    break;
                                case 4:
                                    i = 600
                                    s = 1;
                            }
                            Laya.Tween.to(this.Box5, {
                                    scaleX: s,
                                    scaleY: s
                                },
                                100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                    Laya.Tween.to(this.Box5, {
                                                x: i
                                            },
                                            200, null),
                                        this.IsAni = !1
                                }), t)
                        }
                        this.lqtp.visible = !0;
                        break;
                    case "SkinShop":
                        this.TopBox.visible = !0,
                            this.IsSP = e[2],
                            this.Bg.alpha = 1,
                            e[2] ? (this.sptp.visible = !0, this.sptp.skin = "res/Icon/SkinDebris/Debris" + e[1] + ".png", this.AwardLabel.text = i.AniamlNameData[e[1] - 1] + " piecex1", platform.getInstance().prompt("Congratulations on getting " + i.AniamlNameData[e[1] - 1] + " piecex1！")) : (this.jbtp.visible = !0, this.AwardLabel.text = "x100", platform.getInstance().prompt("Congratulations on getting " + i.AniamlNameData[e[1] - 1] + " piecex1！"), Laya.timer.once(2e3, this, () => {
                                platform.getInstance().prompt("该皮肤已集齐！已兑换成100 gold！")
                            })),
                            this.lqtp.visible = !0;
                        break;
                    case "Skin":
                        this.TopBox.visible = !0,
                            this.AwardNum = e[3],
                            1 == e[3] && z._Instance && z._Instance.PlayerActiveCtrl(!1),
                            this.Bg.alpha = 1,
                            this.AwardLabel.pos(60, 190),
                            i.IsNewSkin = !0,
                            1 == e[2] ? (platform.getInstance().prompt("All pieces are collected, congratulations on getting " + i.AniamlNameData[e[1] - 1] + "x1"), N._Instance.UnLockSkin(e[1])) : platform.getInstance().prompt("Successful purchase！Congratulations on getting " + i.AniamlNameData[e[1] - 1] + "x1"),
                            this.pftp.skin = "res/Icon/Skin/Skin" + e[1] + ".png",
                            this.AwardLabel.text = i.AniamlNameData[e[1] - 1] + "x1",
                            this.pftp.visible = !0,
                            this.lqtp.visible = !0;
                        break;
                    case "Sign":
                        this.IsAni = !0,
                            this.TopBox.visible = !0,
                            this.Bg.alpha = 1,
                            this.AwardData = e[1],
                            this.IsDouble = e[2];
                        for (let e = 0; e < this.AwardData.award.length; e++) {
                            if (0 == e) {
                                let a;
                                switch (this.Box1.visible = !0, 1 == this.AwardData.award[e] ? this.jbtp.visible = !0 : this.zstp.visible = !0, this.AwardLabel.text = "x" + this.AwardData.awardnum[e] * this.IsDouble, this.Box1.pos(375, 351), this.Box1.scale(0, 0), this.AwardData.award.length) {
                                    case 2:
                                        a = 260;
                                        break;
                                    case 3:
                                        a = 150
                                }
                                Laya.Tween.to(this.Box1, {
                                            scaleX: 1.5,
                                            scaleY: 1.5
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box1, {
                                                    x: a
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (1 == e) {
                                let a;
                                switch (this.Box3.visible = !0, 2 == this.AwardData.award[e] ? (this.tltp3.visible = !0, this.AwardLabel3.text = "x" + this.AwardData.awardnum[e] * this.IsDouble) : 3 == this.AwardData.award[e] ? (this.sptp3.visible = !0, this.sptp3.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png", this.AwardLabel3.text = i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1") : 5 == this.AwardData.award[e] && (this.zstp3.visible = !0, this.AwardLabel3.text = "x" + this.AwardData.awardnum[e] * this.IsDouble), this.Box3.pos(375, 351), this.Box3.scale(0, 0), this.AwardData.award.length) {
                                    case 2:
                                        a = 490;
                                        break;
                                    case 3:
                                        a = 375
                                }
                                Laya.Tween.to(this.Box3, {
                                            scaleX: 1.5,
                                            scaleY: 1.5
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box3, {
                                                    x: a
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (2 == e) {
                                let a;
                                switch (this.Box2.visible = !0, 4 == this.AwardData.award[e] && (i.IsNewSkin = !0, this.pftp1.visible = !0, this.pftp1.skin = "res/Icon/Skin/Skin15.png", this.AwardLabel1.text = "狮子王x1", N._Instance.UnLockSkin(15)), this.Box2.pos(375, 351), this.Box2.scale(0, 0), this.AwardData.award.length) {
                                    case 3:
                                        a = 600
                                }
                                Laya.Tween.to(this.Box2, {
                                            scaleX: 1.5,
                                            scaleY: 1.5
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box2, {
                                                    x: a
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            }
                            Laya.timer.once(t, this, () => {
                                    this.IsAni = !1
                                }),
                                this.lqtp.visible = !0
                        }
                        break;
                    case "RankGold":
                        this.TopBox.visible = !0,
                            this.Bg.alpha = 1,
                            this.jbtp.visible = !0,
                            this.AwardLabel.visible = !0,
                            this.AwardLabel.text = "x" + 50 * i.InviteNum,
                            this.lqtp.visible = !0;
                        break;
                    case "Lottery":
                        this.IsAni = !0,
                            this.TopBox.visible = !0,
                            this.Bg.alpha = 1,
                            this.AwardTypeData = e[1],
                            this.AwardData = e[2];
                        for (let e = 0; e < this.AwardTypeData.length; e++)
                            if (0 == e) {
                                let a;
                                switch (this.Box1.visible = !0,
                                    1 == this.AwardTypeData[e] ? (
                                        this.jbtp.visible = !0,
                                        this.AwardLabel.text = "x" + this.AwardData[e]
                                    ) : 2 == this.AwardTypeData[e] ? (
                                        this.tltp.visible = !0,
                                        this.AwardLabel.text = "x" + this.AwardData[e]
                                    ) : 3 == this.AwardTypeData[e] ? (
                                        this.sptp.visible = !0,
                                        this.sptp.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png",
                                        this.AwardLabel.text = i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1"
                                    ) : 4 == this.AwardTypeData[e] ? (
                                        this.zstp.visible = !0,
                                        this.AwardLabel.text = "x" + this.AwardData[e]
                                    ) : 5 == this.AwardTypeData[e] ? (
                                        this.jytp.visible = !0,
                                        this.AwardLabel.text = "x" + this.AwardData[e]
                                    ) : 6 == this.AwardTypeData[e] && (
                                        i.IsNewSkin = !0,
                                        this.AwardLabel.pos(60, 190),
                                        this.pftp.skin = "res/Icon/Skin/Skin11.png",
                                        this.AwardLabel.text = i.AniamlNameData[10] + "x1",
                                        this.pftp.visible = !0,
                                        N._Instance.UnLockSkin(11),
                                        i.IsLotterySkin = 1,
                                        r.save_int("IsLotterySkin", i.IsLotterySkin)
                                    ),
                                    this.Box1.pos(375, 351),
                                    this.Box1.scale(0, 0),
                                    this.AwardTypeData.length) {
                                    case 1:
                                        a = 375;
                                        break;
                                    case 2:
                                        a = 260
                                }
                                Laya.Tween.to(this.Box1, {
                                            scaleX: 1.5,
                                            scaleY: 1.5
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box1, {
                                                    x: a
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (1 == e) {
                            let a;
                            switch (this.Box3.visible = !0, 2 == this.AwardTypeData[e] ? (this.tltp3.visible = !0, this.AwardLabel3.text = "x" + this.AwardData[e]) : 4 == this.AwardTypeData[e] && (this.zstp3.visible = !0, this.AwardLabel3.text = "x" + this.AwardData[e]), this.Box3.pos(375, 351), this.Box3.scale(0, 0), this.AwardTypeData.length) {
                                case 2:
                                    a = 490
                            }
                            Laya.Tween.to(this.Box3, {
                                        scaleX: 1.5,
                                        scaleY: 1.5
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box3, {
                                                x: a
                                            },
                                            200, null)
                                    }), t),
                                t += 300
                        }
                        this.lqtp.visible = !0,
                            Laya.timer.once(t, this, () => {
                                this.IsAni = !1
                            });
                        break;
                    case "Boss":
                        this.IsAni = !0,
                            this.TopBox.visible = !0,
                            this.Bg.alpha = 1,
                            this.AwardData = e[1];
                        for (let e = 0; e < this.AwardData.length; e++)
                            if (0 == e) {
                                let a;
                                switch (
                                    this.Box1.visible = !0,
                                    this.jbtp.visible = !0,
                                    this.AwardLabel.text = "x" + this.AwardData[e],
                                    this.Box1.pos(375, 351),
                                    this.Box1.scale(0, 0),
                                    this.AwardData.length) {
                                    case 2:
                                        a = 260;
                                        break;
                                    case 3:
                                        a = 150
                                }
                                Laya.Tween.to(this.Box1, {
                                            scaleX: 1.5,
                                            scaleY: 1.5
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box1, {
                                                    x: a
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (1 == e) {
                            let a;
                            switch (this.Box3.visible = !0, this.zstp3.visible = !0, this.AwardLabel3.text = "x" + this.AwardData[e], this.Box3.pos(375, 351), this.Box3.scale(0, 0), this.AwardData.length) {
                                case 2:
                                    a = 490;
                                    break;
                                case 3:
                                    a = 375
                            }
                            Laya.Tween.to(this.Box3, {
                                        scaleX: 1.5,
                                        scaleY: 1.5
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box3, {
                                                x: a
                                            },
                                            200, null)
                                    }), t),
                                t += 300
                        } else if (2 == e) {
                            let e;
                            switch (this.Box4.visible = !0, this.sptp4.visible = !0, this.sptp4.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png", this.AwardLabel4.text = i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1", this.Box4.pos(375, 351), this.Box4.scale(0, 0), this.AwardData.length) {
                                case 3:
                                    e = 600
                            }
                            Laya.Tween.to(this.Box4, {
                                        scaleX: 1.5,
                                        scaleY: 1.5
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box4, {
                                                x: e
                                            },
                                            200, null)
                                    }), t),
                                t += 300
                        }
                        this.videotp.visible = !0,
                            this.lblq.visible = !0,
                            1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                                this.SkipBtn.visible = !0
                            }) : this.SkipBtn.visible = !0,
                            Laya.timer.once(t, this, () => {
                                this.IsAni = !1
                            });
                        break;
                    case "ArenaAward":
                        this.IsAni = !0,
                            this.AwardData = e[1],
                            this.AwardNum = e[2],
                            this.Bg.alpha = 1,
                            this.TopBox.visible = !0;
                        for (let e = 0; e < this.AwardData.length; e++) {
                            let a = this.AwardData[e];
                            if (1 == a[0] && 0 != a[1]) {
                                let e, s = 1.5;
                                switch (this.Box1.visible = !0, this.jytp.visible = !0, this.AwardLabel.text = "x" + a[1], this.Box1.pos(375, 351), this.Box1.scale(0, 0), this.AwardNum) {
                                    case 1:
                                        e = 375;
                                        break;
                                    case 3:
                                        e = 150;
                                        break;
                                    case 4:
                                        e = 150
                                        s = 1
                                }
                                Laya.Tween.to(this.Box1, {
                                            scaleX: s,
                                            scaleY: s
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box1, {
                                                    x: e
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (2 == a[0] && 0 != a[1]) {
                                let e, s = 1.5;
                                switch (this.Box3.visible = !0, this.jbtp3.visible = !0, this.AwardLabel3.text = "x" + a[1], this.Box3.pos(375, 351), this.Box3.scale(0, 0), this.AwardNum) {
                                    case 3:
                                        e = 375;
                                        break;
                                    case 4:
                                        e = 300
                                        s = 1
                                }
                                Laya.Tween.to(this.Box3, {
                                            scaleX: s,
                                            scaleY: s
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box3, {
                                                    x: e
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (3 == a[0] && 0 != a[1]) {
                                let e, s = 1.5;
                                switch (this.Box4.visible = !0, this.zstp4.visible = !0, this.AwardLabel4.text = "x" + a[1], this.Box4.pos(375, 351), this.Box4.scale(0, 0), this.AwardNum) {
                                    case 3:
                                        e = 600;
                                        break;
                                    case 4:
                                        e = 450
                                        s = 1;
                                }
                                Laya.Tween.to(this.Box4, {
                                            scaleX: s,
                                            scaleY: s
                                        },
                                        100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                            Laya.Tween.to(this.Box4, {
                                                    x: e
                                                },
                                                200, null)
                                        }), t),
                                    t += 300
                            } else if (4 == a[0] && 0 != a[1]) {
                                let e;
                                switch (this.Box5.visible = !0, this.sptp5.visible = !0, this.sptp5.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png", this.AwardLabel5.text = i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1", this.Box5.pos(375, 351), this.Box5.scale(0, 0), this.AwardNum) {
                                    case 4:
                                        e = 600
                                }
                                Laya.Tween.to(this.Box5, {
                                        scaleX: 1,
                                        scaleY: 1
                                    },
                                    100, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                                        Laya.Tween.to(this.Box5, {
                                                    x: e
                                                },
                                                200, null),
                                            this.IsAni = !1
                                    }), t)
                            }
                        }
                        Laya.timer.once(t, this, () => {
                                this.IsAni = !1
                            }),
                            this.lqtp.visible = !0;
                        break;
                    case "SettleShareGold":
                        this.TopBox.visible = !0,
                            this.gxhdtp.visible = !0,
                            this.jbtp.visible = !0,
                            this.AwardLabel.text = "x100",
                            this.AwardLabel.visible = !0,
                            this.lqtp.visible = !0;
                        break;
                    case "SettleShareDiamond":
                        this.TopBox.visible = !0,
                            this.gxhdtp.visible = !0,
                            this.zstp.visible = !0,
                            this.AwardLabel.text = "x50",
                            this.AwardLabel.visible = !0,
                            this.lqtp.visible = !0;
                        break;
                    case "MFSkin":
                        this.TopBox.visible = !0,
                            this.Bg.alpha = 1,
                            this.AwardLabel.pos(60, 190),
                            i.IsNewSkin = !0,
                            platform.getInstance().prompt("Congratulations on getting free skin Panda！"),
                            this.pftp.skin = "res/Icon/Skin/Skin14.png",
                            this.AwardLabel.text = "Pandax1",
                            this.pftp.visible = !0,
                            this.lqtp.visible = !0,
                            N._Instance.UnLockSkin(14);
                        break;
                    case "GetGold":
                        c.SendMsgToServer([{
                                    key: "scene",
                                    value: 8
                                },
                                {
                                    key: "event_code",
                                    value: 1
                                }
                            ]),
                            this.TopBox.visible = !0,
                            this.gxhdtp.visible = !1,
                            this.mfjb.visible = !0,
                            this.Bg.alpha = 1,
                            this.videotp.pos(60, 56),
                            this.lqtp.pos(171, 56),
                            this.videotp.visible = !0,
                            this.lqtp.visible = !0,
                            this.jbtp.visible = !0,
                            this.AwardNum = e[1],
                            this.AwardLabel.text = "x" + this.AwardNum,
                            1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                                this.SkipBtn1.visible = !0
                            }) : this.SkipBtn1.visible = !0;
                        break;
                    case "GetPower":
                        c.SendMsgToServer([{
                                    key: "scene",
                                    value: 9
                                },
                                {
                                    key: "event_code",
                                    value: 1
                                }
                            ]),
                            this.TopBox.visible = !0,
                            this.gxhdtp.visible = !1,
                            this.mftl.visible = !0,
                            this.Bg.alpha = 1,
                            this.videotp.pos(60, 58.5),
                            this.lqtp.pos(171, 58.5),
                            this.videotp.visible = !0,
                            this.lqtp.visible = !0,
                            this.tltp.visible = !0,
                            this.AwardLabel.text = "x5",
                            1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                                this.SkipBtn1.visible = !0
                            }) : this.SkipBtn1.visible = !0;
                        break;
                    case "GetDiamond":
                        c.SendMsgToServer([{
                                    key: "scene",
                                    value: 12
                                },
                                {
                                    key: "event_code",
                                    value: 1
                                }
                            ]),
                            this.AwardNum = e[1],
                            this.TopBox.visible = !0,
                            this.gxhdtp.visible = !1,
                            this.mfzs.visible = !0,
                            this.Bg.alpha = 1,
                            this.videotp.pos(83, 58.5),
                            this.lqtp.pos(171, 58.5),
                            this.videotp.visible = !0,
                            this.lqtp.visible = !0,
                            this.zstp.visible = !0,
                            this.AwardLabel.text = "x100",
                            1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                                this.SkipBtn1.visible = !0
                            }) : this.SkipBtn1.visible = !0
                }
                "GetGold" == e[0] ? (L.BannerShowData[10] = !0, s.SetBtnBottom(this.SkipBtn1, 280), L.CreateBannerAd("adunit-eb38c0440bf0b4de")) : "GetPower" == e[0] ? (L.BannerShowData[11] = !0, s.SetBtnBottom(this.SkipBtn1, 280), L.CreateBannerAd("adunit-e2cd7550b521e129")) : "GetDiamond" == e[0] ? (L.BannerShowData[12] = !0, s.SetBtnBottom(this.SkipBtn1, 280), L.CreateBannerAd("adunit-67969b1277a94d82")) : (L.BannerShowData[8] = !0, s.SetBtnBottom(this.SkipBtn, 280), L.CreateBannerAd("adunit-16ffbe9e3d0b1682"), "Gift" != e[0] ? i.MaxLevel > 3 && Math.random() >= .5 && (L.IsShowGetAwardInterstitialAd = !0, L.CreateInterstitialAd("adunit-5301ede4ea80c693")) : i.MaxLevel > 3 && Math.random() >= .5 && (L.IsShowGiftInterstitialAd = !0, L.CreateInterstitialAd("adunit-4412434ba3d4c013")))
            }
        }
        onEnable() {}
        GetAward() {
            if (n.PlaySound("click"), this.IsAni) platform.getInstance().prompt("Counting your result...");
            else switch (this.OpenType) {
                case "SettleGold":
                    console.log("this.AwardNum:" + this.AwardNum);
                    4 == this.AwardNum ? (i.GetGold *= 10, this.GetAwardCallBack()) :
                        platform.getInstance().showReward(() => {
                            i.GetGold *= 10,
                                this.GetAwardCallBack()
                        });
                    break;
                case "SettleLottery":
                    this.close(),
                        ne._Instance.AddDoubleExp(this.AwardNum);
                    break;
                case "Gift":
                    c.SendMsgToServer([{
                                key: "scene",
                                value: 7
                            },
                            {
                                key: "event_code",
                                value: 1
                            }
                        ]),
                        this.GetAwardCallBack();
                    break;
                case "SkinShop":
                    this.IsSP ? (N._Instance.UpdataSkinDebris(0), re._Instance.VideoSkinSet(), this.close()) : this.GetAwardCallBack();
                    break;
                case "Skin":
                    platform.getInstance().prompt("Receive success！Please check in your skin！"),
                        this.close(),
                        1 == this.AwardNum && z._Instance && z._Instance.PlayerActiveCtrl(!0);
                    break;
                case "Sign":
                case "RankGold":
                case "Lottery":
                    this.GetAwardCallBack();
                    break;
                case "Boss":
                    platform.getInstance().showReward(() => {
                        for (let e = 0; e < this.AwardData.length; e++) e <= 1 && (this.AwardData[e] *= 2);
                        this.GetAwardCallBack()
                    });
                    break;
                case "ArenaAward":
                case "SettleShareGold":
                case "SettleShareDiamond":
                    this.GetAwardCallBack();
                    break;
                case "MFSkin":
                    platform.getInstance().prompt("Receive success！Please check in your skin！"),
                        Laya.View.open("Scene/StartPanel.scene");
                    break;
                case "GetGold":
                    platform.getInstance().showReward(() => {
                        this.GetAwardCallBack()
                    });
                    break;
                case "GetPower":
                    platform.getInstance().showReward(() => {
                        this.GetAwardCallBack()
                    });
                    break;
                case "GetDiamond":
                    platform.getInstance().showReward(() => {
                        this.GetAwardCallBack()
                    });
            }
        }
        GetAwardCallBack() {
            if (!this.IsGetAward) {
                this.IsGetAward = !0;
                let e = "";
                switch (this.OpenType) {
                    case "SettleGold":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateGold(i.GetGold),
                            platform.getInstance().prompt("Congratulations on getting " + i.GetGold + " gold！"),
                            s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    Laya.View.open("Scene/StartPanel.scene", !0, [2]),
                                        N._Instance.ReGame()
                                })
                            }));
                        break;
                    case "Gift":
                        n.PlaySound("gotGold");
                        for (let t = 0; t < this.AwardData.length; t++) 0 == t && 0 != this.AwardData[t] ? (N._Instance.UpdateGold(this.AwardData[t]), e += "Congratulations on getting " + this.AwardData[t] + " gold、", s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, null)) : 1 == t && 0 != this.AwardData[t] ? (e += i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1、", N._Instance.UpdataSkinDebris(1)) : 2 == t && 0 != this.AwardData[t] ? (N._Instance.UpdatePower(5), e += "5 strength、", s.flyDiamondAni("res/Icon/power.png", 375, 550, this.Power.x, this.Power.y, this, null)) : 3 == t && 0 != this.AwardData[t] && (N._Instance.UpdateDiamond(this.AwardData[t]), e += this.AwardData[t] + " diamond！", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                Laya.View.open("Scene/StartPanel.scene")
                            })
                        })));
                        platform.getInstance().prompt(e);
                        break;
                    case "SkinShop":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateGold(100),
                            platform.getInstance().prompt("Congratulations on getting 100 gold！"),
                            s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close()
                                })
                            }));
                        break;
                    case "Sign":
                        n.PlaySound("gotGold");
                        for (let t = 0; t < this.AwardData.award.length; t++) 0 == t ? 1 == this.AwardData.award[t] ? (N._Instance.UpdateGold(this.AwardData.awardnum[t] * this.IsDouble), e += "Congratulations on getting " + this.AwardData.awardnum[t] * this.IsDouble + " gold、", 3 == this.AwardData.award[t + 1] ? s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close()
                            })
                        })) : s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, null)) : 5 == this.AwardData.award[t] && (N._Instance.UpdateDiamond(this.AwardData.awardnum[t] * this.IsDouble), e += "Congratulations on getting " + this.AwardData.awardnum[t] * this.IsDouble + " diamond、", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close()
                            })
                        }))) : 1 == t ? 2 == this.AwardData.award[t] ? (N._Instance.UpdatePower(this.AwardData.awardnum[t] * this.IsDouble), e += this.AwardData.awardnum[t] * this.IsDouble + " strength！", s.flyDiamondAni("res/Icon/power.png", 375, 550, this.Power.x, this.Power.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close()
                            })
                        }))) : 3 == this.AwardData.award[t] ? (e += i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1！", N._Instance.UpdataSkinDebris(0)) : 5 == this.AwardData.award[t] && (N._Instance.UpdateDiamond(this.AwardData.awardnum[t] * this.IsDouble), 2 == this.AwardData.award.length ? e += this.AwardData.awardnum[t] * this.IsDouble + " diamond！" : e += this.AwardData.awardnum[t] * this.IsDouble + " diamond、", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close()
                            })
                        }))) : 2 == t && 4 == this.AwardData.award[t] && (e += "The Lion Kingx1！Please check in your skin！");
                        platform.getInstance().prompt(e);
                        break;
                    case "RankGold":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateGold(50 * i.InviteNum),
                            platform.getInstance().prompt("Congratulations on getting " + 50 * i.InviteNum + " gold！"),
                            i.InviteNum = 0,
                            i.NextInviteNum = 0,
                            r.save_int("NextInviteNum", i.NextInviteNum),
                            s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close()
                                })
                            }));
                        break;
                    case "Lottery":
                        let t = !0;
                        for (let a = 0; a < this.AwardTypeData.length; a++)
                            if (3 != this.AwardTypeData[a] && 5 != this.AwardTypeData[a] && 6 != this.AwardTypeData[a] || (t = !1), 0 == a)
                                if (1 == this.AwardTypeData[a]) N._Instance.UpdateGold(this.AwardData[a]),
                                    1 == this.AwardTypeData.length ? (e += "Congratulations on getting " + this.AwardData[a] + " gold！", s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                        Laya.timer.once(300, this, () => {
                                            this.close(),
                                                ce._Instance.RefreshBtn(),
                                                ce._Instance.PlayEffect()
                                        })
                                    }))) : (e += "Congratulations on getting " + this.AwardData[a] + " gold、", s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, null));
                                else if (2 == this.AwardTypeData[a]) N._Instance.UpdatePower(this.AwardData[a]),
                            e += "Congratulations on getting " + this.AwardData[a] + " strength！",
                            s.flyDiamondAni("res/Icon/power.png", 375, 550, this.Power.x, this.Power.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close(),
                                        ce._Instance.RefreshBtn(),
                                        ce._Instance.PlayEffect()
                                })
                            }));
                        else if (3 == this.AwardTypeData[a]) N._Instance.UpdataSkinDebris(0),
                            e += "Congratulations on getting " + i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1！",
                            this.close(),
                            ce._Instance.RefreshBtn(),
                            ce._Instance.PlayEffect();
                        else if (4 == this.AwardTypeData[a]) N._Instance.UpdateDiamond(this.AwardData[a]),
                            e += "Congratulations on getting " + this.AwardData[a] + " diamond！",
                            s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close(),
                                        ce._Instance.RefreshBtn(),
                                        ce._Instance.PlayEffect()
                                })
                            }));
                        else if (5 == this.AwardTypeData[a]) {
                            N._Instance.UpdateBadgeLv(this.AwardData[a]) && ce._Instance && (ce._Instance.IsLottery = !0, Laya.timer.once(400, null, () => {
                                    ce._Instance.IsLottery = !1
                                })),
                                e += "Congratulations on getting " + this.AwardData[a] + "exp",
                                this.close(),
                                ce._Instance.RefreshBtn(),
                                ce._Instance.PlayEffect()
                        } else 6 == this.AwardTypeData[a] && (e += "Receive success！Please check in your skin！", this.close(), ce._Instance.RefreshBtn(), ce._Instance.PlayEffect());
                        else 1 == a && (2 == this.AwardTypeData[a] ? (N._Instance.UpdatePower(this.AwardData[a]), e += "Congratulations on getting " + this.AwardData[a] + " strength！", s.flyDiamondAni("res/Icon/power.png", 375, 550, this.Power.x, this.Power.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close(),
                                    ce._Instance.RefreshBtn(),
                                    ce._Instance.PlayEffect()
                            })
                        }))) : 4 == this.AwardTypeData[a] && (N._Instance.UpdateDiamond(this.AwardData[a]), e += "Congratulations on getting " + this.AwardData[a] + " diamond！", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(300, this, () => {
                                this.close(),
                                    ce._Instance.RefreshBtn(),
                                    ce._Instance.PlayEffect()
                            })
                        }))));
                        t && n.PlaySound("gotGold"),
                            platform.getInstance().prompt(e);
                        break;
                    case "Boss":
                        n.PlaySound("gotGold");
                        for (let t = 0; t < this.AwardData.length; t++) 0 == t ? (N._Instance.UpdateGold(this.AwardData[t]), e += "Congratulations on getting " + this.AwardData[t] + " gold、", s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, null)) : 1 == t ? (N._Instance.UpdateDiamond(this.AwardData[t]), 2 == this.AwardData.length ? e += this.AwardData[t] + " diamond！" : e += this.AwardData[t] + " diamond、", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                            Laya.timer.once(250, this, () => {
                                Laya.View.open("Scene/SettlePanel.scene")
                            })
                        }))) : 2 == t && (e += i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1！", N._Instance.UpdataSkinDebris(0));
                        platform.getInstance().prompt(e);
                        break;
                    case "ArenaAward":
                        n.PlaySound("gotGold");
                        for (let t = 0; t < this.AwardData.length; t++) {
                            let a = this.AwardData[t];
                            1 == a[0] && 0 != a[1] ? 1 == this.AwardNum ? (e += "Congratulations on getting " + a[1] + " exp！", 1 == i.ExportSwitch && i.SettleExportGameData.length > 0 && 1 == i.SettleSwitch ? Laya.View.open("Scene/SettleExportPanel.scene", !1, [0, 0, 2]) : Laya.View.open("Scene/StartPanel.scene"), N._Instance.UpdateBadgeLv(a[1])) : (e += "Congratulations on getting " + a[1] + " exp、", N._Instance.UpdateBadgeLv(a[1], !1)) : 2 == a[0] && 0 != a[1] ? (N._Instance.UpdateGold(a[1]), e += "Congratulations on getting " + a[1] + " gold、", s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, null)) : 3 == a[0] && 0 != a[1] ? (N._Instance.UpdateDiamond(a[1]), 3 == this.AwardNum ? e += "Congratulations on getting " + a[1] + " diamond！" : e += "Congratulations on getting " + a[1] + " diamond、", s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(250, this, () => {
                                    1 == i.ExportSwitch && i.SettleExportGameData.length > 0 && 1 == i.SettleSwitch ? Laya.View.open("Scene/SettleExportPanel.scene", !1, [0, 0, 2]) : Laya.View.open("Scene/StartPanel.scene")
                                })
                            }))) : 4 == a[0] && 0 != a[1] && (e += i.AniamlNameData[i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] - 1] + " piecex1！", N._Instance.UpdataSkinDebris(1))
                        }
                        platform.getInstance().prompt(e);
                        break;
                    case "SettleShareGold":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateGold(100),
                            platform.getInstance().prompt("Congratulations on getting 100 gold！"),
                            s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close()
                                })
                            }));
                        break;
                    case "SettleShareDiamond":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateDiamond(50),
                            platform.getInstance().prompt("Congratulations on getting 50 diamond！"),
                            s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close()
                                })
                            }));
                        break;
                    case "GetGold":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateGold(this.AwardNum),
                            platform.getInstance().prompt("Congratulations on getting " + this.AwardNum + " gold！"),
                            s.flyDiamondAni("res/Icon/gold.png", 375, 550, this.Gold.x, this.Gold.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close()
                                })
                            }));
                        break;
                    case "GetPower":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdatePower(5),
                            platform.getInstance().prompt("Congratulations on getting 5 strength！"),
                            s.flyDiamondAni("res/Icon/power.png", 375, 550, this.Power.x, this.Power.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close(),
                                        z._Instance.PlayerActiveCtrl(!0)
                                })
                            }));
                        break;
                    case "GetDiamond":
                        n.PlaySound("gotGold"),
                            N._Instance.UpdateDiamond(100),
                            platform.getInstance().prompt("Congratulations on getting 100 diamond！"),
                            s.flyDiamondAni("res/Icon/zuanshi.png", 375, 550, this.Diamond.x, this.Diamond.y, this, Laya.Handler.create(this, () => {
                                Laya.timer.once(300, this, () => {
                                    this.close(),
                                        1 == this.AwardNum && (de._Instance.SkinBox.active = !0)
                                })
                            }))
                }
            }
        }
        Skip() {
            switch (n.PlaySound("click"), this.OpenType) {
                case "SettleGold":
                    this.GetAwardCallBack();
                    break;
                case "GetGold":
                    this.close();
                    break;
                case "GetPower":
                    this.close(),
                        z._Instance.PlayerActiveCtrl(!0);
                    break;
                case "GetDiamond":
                    this.close(),
                        1 == this.AwardNum && (de._Instance.SkinBox.active = !0);
                    break;
                case "Boss":
                    this.GetAwardCallBack()
            }
        }
        PowerRefresh() {
            if (i.Power < i.MaxPower) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    this.PowerTimeLabel.visible = !0,
                    this.IsConutTimer = !0,
                    Laya.timer.loop(1e3, this, this.CountDown)
            } else this.PowerTimeLabel.visible = !1
        }
        CountDown() {
            if (this.IsConutTimer) {
                let e = Math.floor(600 - (parseInt(((new Date).getTime() / 1e3).toString()) - i.PowerTimeStamp));
                this.PowerTimeLabel.text = o.Addo(parseInt((e / 60).toString())) + ":" + o.Addo(e % 60),
                    e <= 0 && (this.IsConutTimer = !1, Laya.timer.clear(this, this.CountDown), i.PowerTimeStamp = 0, r.save_int("PowerTimeStamp", i.PowerTimeStamp), N._Instance.UpdatePower(1), this.PowerRefresh())
            }
        }
        Update() {
            this.ZZTP.rotation += .5,
                this.GoldLabel.text = i.Gold.toString(),
                this.DiamondLabel.text = i.Diamond.toString(),
                this.PowerLabel.text = i.Power + "/" + i.MaxPower,
                this.IsConutTimer || this.PowerTimeLabel.visible || this.PowerRefresh()
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.IsShowGetAwardInterstitialAd = !1,
                L.IsShowGiftInterstitialAd = !1,
                L.BannerShowData[8] = !1,
                L.BannerShowData[10] = !1,
                L.BannerShowData[11] = !1,
                L.BannerShowData[12] = !1,
                L.GetAwardBanner && L.GetAwardBanner.hide(),
                L.GetGoldBanner && L.GetGoldBanner.hide(),
                L.GetPowerBanner && L.GetPowerBanner.hide(),
                L.GetDiamondBanner && L.GetDiamondBanner.hide()
        }
    }
    class fe extends Laya.Script {
        constructor() {
            super()
        }
        static Init() {
            //localStorage.clear();
            let e = r.load_int("UId");
            e ? (i.UId = e, c.UId = e) : (i.UId = 0, c.UId = 0);
            let t = r.load_string("Head");
            i.Head = t || "res/Icon/Head/yktp.jpg";
            let a = r.load_string("Name");
            i.Name = a || "Player";
            let s = r.load_int("MaxLevel");
            i.MaxLevel = s || 1;
            let n = r.load_int("Badge");
            i.Badge = n || 1;
            let l = r.load_int("BadgeLv");
            i.BadgeLv = l || 1;
            let h = r.load_int("Exp");
            i.Exp = h || 0,
                i.Badge <= 2 ? 1 == i.Badge && 1 == i.BadgeLv ? i.MaxExp = 500 : 4 == i.BadgeLv ? i.MaxExp = 1e3 * (i.Badge + 1) : i.MaxExp = 1e3 * i.Badge : 5 == i.BadgeLv ? i.MaxExp = 1e3 * (i.Badge + 1) : i.MaxExp = 1e3 * i.Badge;
            let d = r.load_int("Gold");
            i.Gold = d || 0;
            let p = r.load_int("Diamond");
            i.Diamond = p || 0;
            let m = r.load_int("Power");
            m ? i.Power = m : 0 == m ? i.Power = 0 : (i.Power = 15, i.PowerTimeStamp = 0);
            let y = r.load_int("PowerTimeStamp");
            if (y) {
                let e = (new Date).getTime() / 1e3 - y,
                    t = Math.floor(e / 600);
                i.Power += t,
                    i.Power >= i.MaxPower ? (i.Power = i.MaxPower, i.PowerTimeStamp = 0) : i.PowerTimeStamp = t > 0 ? (new Date).getTime() / 1e3 - e % 600 : y,
                    r.save_int("Power", i.Power),
                    r.save_int("PowerTimeStamp", i.PowerTimeStamp)
            } else i.PowerTimeStamp = 0;
            let f = r.load_int("SkinId");
            i.SkinId = f || 1,
                i.MonsterResData = [],
                i.MonsterResData.push(0),
                i.MonsterResData.push(i.SkinId);
            let S = r.load_string("SkinData");
            if (S) {
                let e = JSON.parse(S);
                //console.log("皮肤数据！！！", e),
                i.SkinData = e
            } else i.SkinData = [1];
            for (let e = 0; e < i.SkinData.length; e++) i.ReLoadMonsterResData.push(i.SkinData[e]);
            let L = r.load_int("SkinColorId");
            i.SkinColorId = L || 1;
            let v = r.load_string("SkinColorData");
            if (v) {
                let e = JSON.parse(v);
                //console.log("炫彩皮肤数据！！！", e),
                i.SkinColorData = e
            } else {
                let e = {
                        skinid: 1,
                        userid: 1
                    },
                    t = [];
                for (let a = 1; a <= 6; a++) {
                    let i = {};
                    i.skinid = e.skinid,
                        i.colorid = a,
                        1 == a ? (i.isuser = 1, i.islock = 1) : (i.isuser = 0, i.islock = 0),
                        t.push(i)
                }
                e.skincolordata = t,
                    i.SkinColorData.push(e)
            }
            let I = r.load_string("DowerData");
            if (I) {
                let e = JSON.parse(I);
                //console.log("天赋数据！！！", e),
                i.DowerData = e
            } else {
                i.DowerData = [];
                for (let e = 1; e <= 3; e++) {
                    let t = {};
                    switch (t.dowertype = e, t.dowerlv = 0, e) {
                        case 1:
                            t.diamonddata = [100, 100, 200, 300, 300, 400, 500, 600, 700];
                            break;
                        case 2:
                            t.diamonddata = [100, 100, 200, 200, 300, 400, 500, 600, 700];
                            break;
                        case 3:
                            t.diamonddata = [100, 150, 200, 250, 300, 350, 400, 450, 500]
                    }
                    i.DowerData.push(t)
                }
            }
            let w = r.load_int("IsSevenDay");
            i.IsSevenDay = w || 0;
            let u = r.load_int("NextSignDay");
            i.NextSignDay = u || 1;
            let g = r.load_int("CurrSignDay");
            i.CurrSignDay = g || 1;
            let k = r.load_int("ZeroTimeStamp");
            if (k) {
                if (i.ZeroTimeStamp = k, (new Date).getTime() / 1e3 >= i.ZeroTimeStamp) {
                    i.IsSign = 0;
                    let e = 1;
                    e = i.NextSignDay % 7 == 0 ? 7 : i.NextSignDay % 7,
                        i.NextSignDay > 7 && (i.IsSevenDay = 1, r.save_int("IsSevenDay", i.IsSevenDay)),
                        i.CurrSignDay = e,
                        r.save_int("CurrSignDay", i.CurrSignDay)
                } else i.IsSign = 1
            } else i.ZeroTimeStamp = 0,
                i.IsSign = 0;
            let b = r.load_int("GiftIndex");
            i.GiftIndex = b || 0;
            let B = r.load_int("GiftEightTimeStamp");
            i.GiftEightTimeStamp = B || 0;
            let x = r.load_string("SkinDebrisData");
            if (x) {
                let e = JSON.parse(x);
                i.SkinDebrisData = e
            } else {
                let e = [2, 3, 4, 8, 9, 10, 17, 18, 19];
                for (let t = 0; t < 9; t++) {
                    let a = {};
                    a.skinid = e[t],
                        a.debrisnum = 0,
                        i.SkinDebrisData.push(a)
                }
                //console.log("皮肤 piece数据:", i.SkinDebrisData)
            }
            let T = r.load_int("SkinDebrisOrderIndex");
            i.SkinDebrisOrderIndex = T || 0;
            let C = r.load_int("NextInviteNum");
            C ? (i.NextInviteNum = C, i.InviteNum = i.NextInviteNum) : (i.NextInviteNum = 0, i.InviteNum = 0);
            let D = r.load_int("IsLotterySkin");
            i.IsLotterySkin = D || 0;
            let M = r.load_int("RankLevelTimeStamp");
            i.RankLevelTimeStamp = M || 0;
            let P = r.load_int("RankBadgeTimeStamp");
            i.RankBadgeTimeStamp = P || 0;
            let _ = r.load_string("RankData");
            if (_) {
                let e = JSON.parse(_),
                    t = (new Date).getTime() / 1e3,
                    a = !1,
                    s = !1;
                t >= i.RankBadgeTimeStamp && (a = !0),
                    t >= i.RankLevelTimeStamp && (s = !0);
                for (let t = 0; t < e.length; t++) a && (e[t].badge <= 2 ? 4 == e[t].badgelv ? (e[t].badgelv = 1, e[t].badge++) : e[t].badgelv++ : 5 == e[t].badgelv ? 7 == e[t].badge ? (e[t].badge = 7, e[t].badgelv = 5) : (e[t].badge++, e[t].badgelv = 1) : e[t].badgelv++),
                    s && (e[t].level += Math.round(4 * Math.random()) + 3);
                i.RankData = e;
                let n = JSON.stringify(i.RankData);
                r.save_string("RankData", n),
                    a && (i.RankBadgeTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 172800, r.save_int("RankBadgeTimeStamp", i.RankBadgeTimeStamp)),
                    s && (i.RankLevelTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400, r.save_int("RankLevelTimeStamp", i.RankLevelTimeStamp))
            } else {
                i.RankData = [];
                let e = o.GetNonredundantNum1(),
                    t = o.GetDataRandom({
                        arry: i.EnemyNameData,
                        range: 100
                    });
                for (let a = 0; a < 100; a++) {
                    let s = {
                        isself: 0
                    };
                    s.icon = "res/Icon/Head/" + e[a] + ".jpg",
                        s.name = t[a],
                        s.badge = i.RankBadgeData[a],
                        s.badgelv = i.RankBadgeLvData[a],
                        s.level = a <= 25 ? 150 - 2 * a : a > 25 && a <= 79 ? 125 - a : 204 - 2 * a,
                        i.RankData.push(s)
                }
                let a = JSON.stringify(i.RankData);
                r.save_string("RankData", a),
                    i.RankBadgeTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 172800,
                    r.save_int("RankBadgeTimeStamp", i.RankBadgeTimeStamp),
                    i.RankLevelTimeStamp = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400,
                    r.save_int("RankLevelTimeStamp", i.RankLevelTimeStamp)
            }
            let A = r.load_int("IsMFLottery");
            i.IsMFLottery = A || 0;
            let E = r.load_int("MFLotteryTimeStamp");
            if (E) {
                i.MFLotteryTimeStamp = E,
                    (new Date).getTime() / 1e3 >= i.MFLotteryTimeStamp && (i.IsMFLottery = 0, r.save_int("IsMFLottery", i.IsMFLottery))
            } else i.MFLotteryTimeStamp = 0;
            let G = r.load_int("IsTowDay");
            i.IsTowDay = G || 0;
            let R = r.load_int("LotteryIndex");
            i.LotteryIndex = R || 1;
            let V = r.load_int("LotteryIndexTimeStamp");
            if (V) {
                i.LotteryIndexTimeStamp = V,
                    (new Date).getTime() / 1e3 >= i.LotteryIndexTimeStamp && (i.LotteryIndex = 1, r.save_int("LotteryIndex", i.LotteryIndex), i.IsTowDay = 1, r.save_int("IsTowDay", i.IsTowDay))
            } else i.LotteryIndexTimeStamp = 0;
            let H = r.load_int("IsMFBuff");
            i.IsMFBuff = H || 0;
            let O = r.load_int("IsTwoMFRevive");
            i.IsTwoMFRevive = O || 0;
            let U = r.load_int("IsMFRevive");
            i.IsMFRevive = U || 0;
            let N = r.load_int("IsOpenSign");
            i.IsOpenSign = N || 0;
            let z = r.load_string("SettleShareData");
            if (z) {
                let e = JSON.parse(z);
                i.SettleShareData = e
            } else {
                let e = {
                    level: 1,
                    issharegold: !1,
                    issharediamond: !1
                };
                i.SettleShareData = e
            }
            let F = r.load_int("IsTwoDayTime");
            if (F) {
                i.IsTwoDayTime = F,
                    (new Date).getTime() / 1e3 >= i.IsTwoDayTime ? i.IsTwoDay = 1 : i.IsTwoDay = 0
            } else i.IsTwoDay = 0,
                i.IsTwoDayTime = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400,
                r.save_int("IsTwoDayTime", i.IsTwoDayTime);
            let X = r.load_int("IsRefuseYQ");
            i.IsRefuseYQ = X || 0;
            let Y = r.load_int("IsRefuseYQTime");
            if (Y) {
                i.IsRefuseYQTime = Y,
                    (new Date).getTime() / 1e3 >= i.IsRefuseYQTime && (i.IsRefuseYQ = 0, r.save_int("IsRefuseYQ", i.IsRefuseYQ))
            } else i.IsRefuseYQTime = 0;
            i.LoadingNum++
                //console.log("本地数据加载成功！当前进度：" + i.LoadingNum)
        }
    }
    class Se extends Laya.Script {
        static Init() {
            X.GetPhoneMsg(),
                fe.Init(),
                H.Init()
        }
        static LoadMsgData() {
            // window.wx.loadSubpackage({
            // 	name: "GameScene",
            // 	success: function(e) {
            p.Init(i.MonsterResData, 0),
                Laya.loader.create("GameScene/Tails/Conventional/Tails.lh",
                    Laya.Handler.create(this, () => {
                        i.LoadingNum++
                            //console.log("尾巴模型加载成功！当前进度是：" + i.LoadingNum)
                    })
                )
            Laya.loader.create("GameScene/Floor/Conventional/Floor.lh",
                Laya.Handler.create(this, () => {
                    i.LoadingNum++
                        //console.log("地板模型加载成功！当前进度是：" + i.LoadingNum)
                })
            )
            Laya.loader.create("GameScene/Prop/Conventional/Prop.lh",
                Laya.Handler.create(this, () => {
                    i.LoadingNum++
                        //console.log("道具模型加载成功！当前进度是：" + i.LoadingNum)
                })
            )
            //i.EffectResData = [13],
            f.Init(i.EffectResData, !0)
            // 	},
            // 	fail: function(e) {
            // 		console.log("分包失败"),
            // 		Se.LoadMsgData()
            // 	}
            // })
        }
        static LoadScene() {
            var e = Laya.stage.addChild(Laya.loader.getRes("GameScene/Scene/Conventional/Scene.ls"));
            Laya.stage.setChildIndex(e, 0),
                e.addComponent(N)
        }
    }
    class Le extends e.Scene.LoadingPanelUI {
        constructor() {
            super(),
                this.IsLoadRes = !0,
                this.IsLoadScene = !0,
                this.IsOpenUI = !0,
                this.TipsData = [""],
                this.IsSendMgsToServer = !1,
                this.istips = !1,
                this.AlterStateIndex = 0,
                this.TipsIndex = 0
        }
        onAwake() {
            s.MatchScreen(this);
            let e = Laya.stage.height / 1334,
                t = Laya.stage.width / 750;
            e >= t ? this.Bg.scale(e, e) : this.Bg.scale(t, t),
                Laya.timer.frameLoop(1, this, this.Update),
                this.OpenTipsLabel()
        }
        OpenTipsLabel() {
            Laya.Tween.to(this.LoadingBox, {
                        y: -65
                    },
                    5e3, null),
                Laya.timer.once(600, this, () => {
                    Laya.Tween.to(this.Tips1Label, {
                            alpha: 1
                        },
                        2400)
                }),
                Laya.timer.once(2600, this, () => {
                    Laya.Tween.to(this.Tips2Label, {
                            alpha: 1
                        },
                        1500, null)
                }),
                Laya.timer.once(4600, this, () => {
                    Laya.Tween.to(this.Tips3Label, {
                            alpha: 1
                        },
                        600, null)
                })
        }
        onEnable() {}
        Update() {
            this.IsSendMgsToServer || 0 == c.UId || (this.IsSendMgsToServer = !0, c.SendMsgToServer([{
                        key: "scene",
                        value: 0
                    },
                    {
                        key: "event_code",
                        value: 0
                    }
                ])),
                i.LoadingNum <= 4 ?
                (
                    this.LoadingTP.width = 170 * i.LoadingNum,
                    this.LoadingLabel.text = Math.ceil(25 * i.LoadingNum) + "%",
                    this.ZZTP.x = this.LoadingTP.width + 80,
                    2 == i.LoadingNum && this.IsLoadRes ?
                    (
                        this.IsLoadRes = !1,
                        a.IsIphoneX ? i.Boxbottom = 320 : i.Boxbottom = 280,
                        Se.LoadMsgData()
                    ) :
                    4 == i.LoadingNum &&
                    (
                        this.LoadingTP.width = 0,
                        this.LoadingLabel.text = "0%",
                        this.ZZTP.x = this.LoadingTP.width + 80
                    )
                ) : (
                    this.LoadingTP.width = 170 * (i.LoadingNum - 4),
                    this.LoadingLabel.text = Math.ceil(25 * (i.LoadingNum - 4)) + "%",
                    this.ZZTP.x = this.LoadingTP.width + 80,
                    7 == i.LoadingNum && this.IsLoadScene ?
                    (
                        this.IsLoadScene = !1,
                        Laya.loader.create("GameScene/Scene/Conventional/Scene.ls",
                            Laya.Handler.create(Se, Se.LoadScene))
                    ) : 8 == i.LoadingNum && this.IsOpenUI &&
                    (true ? (this.IsOpenUI = !1,
                        c.SendMsgToServer([{
                                key: "scene",
                                value: 13
                            },
                            {
                                key: "event_code",
                                value: 1
                            }
                        ]),
                        Laya.loader.load("cnf.json", Laya.Handler.create(this, (res) => {
                            platform.getInstance().yadstartup("Animal-Io", () => {
                                window.WebAudioEngine.playSound("GameScene/Sound/bgm.mp3", !0)
                                let yad = new Laya.Image();
                                yad.scale(0.8, 0.8);
                                yad.skin = "yad.png";
                                yad.bottom = 0;
                                yad.centerX = 0;
                                //yad.top   = 10;
                                yad.zOrder = 1e3;
                                yad.on(Laya.Event.MOUSE_DOWN, yad, () => {
                                    platform.getInstance().navigate("GAME", "LOGO")
                                })
                                Laya.stage.addChild(yad);
                                window.yad = yad;
                                let audioArr = ["GameScene/Sound/ArenaFall.mp3", "GameScene/Sound/ArenaWin.mp3", "GameScene/Sound/badgelv.mp3", "GameScene/Sound/bgm.mp3", "GameScene/Sound/bgm1.mp3", "GameScene/Sound/bomb.mp3", "GameScene/Sound/cion.mp3", "GameScene/Sound/click.mp3", "GameScene/Sound/count.mp3", "GameScene/Sound/daojishi.mp3", "GameScene/Sound/Devour.mp3", "GameScene/Sound/fail.mp3", "GameScene/Sound/Fall.mp3", "GameScene/Sound/gaizhang.mp3", "GameScene/Sound/getaward.mp3", "GameScene/Sound/gotGold.mp3", "GameScene/Sound/kill.mp3", "GameScene/Sound/kill1.mp3", "GameScene/Sound/kill2.mp3", "GameScene/Sound/kill3.mp3", "GameScene/Sound/kill4.mp3", "GameScene/Sound/kill5.mp3", "GameScene/Sound/kill6.mp3", "GameScene/Sound/kill7.mp3", "GameScene/Sound/knock_01.mp3", "GameScene/Sound/knock_02.mp3", "GameScene/Sound/Luck.mp3", "GameScene/Sound/pfcj.mp3", "GameScene/Sound/reward.mp3", "GameScene/Sound/Settlement.mp3", "GameScene/Sound/upgrade.mp3", "GameScene/Sound/victory.mp3"];
                                AudioEngineInstance.load(audioArr, () => {
                                    Laya.loader.load(this.gameList, Laya.Handler.create(this, () => {
                                        Laya.View.open("Scene/StartPanel.scene"),
                                            X.OpenShareMenu()
                                        //n.PlayBGM1(), 
                                        //console.log("加载完毕！！！！！！！！！！！")
                                    }));
                                });
                            });
                        }))

                    ) : (
                        this.LoadingTP.width = 170 * (i.LoadingNum - 4) - 6.8,
                        this.LoadingLabel.text = "99%",
                        this.AlterStateIndex++,
                        this.AlterStateIndex >= 720 && !this.istips && (this.istips = !0, platform.getInstance().prompt(""))
                    ))),
                i.LoadingNum <= 4 ? (this.Gift1Label.visible = !0,
                    this.Gift2Label.visible = !1,
                    this.TipsIndex++,
                    8 == this.TipsIndex ? this.Gift1Label.text = "The little monster is preparing the gift.." :
                    16 == this.TipsIndex ? this.Gift1Label.text = "The little monster is preparing the gift..." :
                    this.TipsIndex >= 24 && (this.TipsIndex = 0, this.Gift1Label.text = "The little monster is preparing the gift.")
                ) : (
                    this.Gift1Label.visible = !1,
                    this.Gift2Label.visible = !0,
                    this.TipsIndex++,
                    8 == this.TipsIndex ? this.Gift2Label.text = "The little monster is coming out.." :
                    16 == this.TipsIndex ? this.Gift2Label.text = "The little monster is coming out..." :
                    this.TipsIndex >= 24 && (this.TipsIndex = 0, this.Gift2Label.text = "The little monster is coming out.")
                )
        }
        onDisable() {}
    }
    class ve extends e.Scene.MFSkinPanelUI {
        constructor() {
            super(),
                this.MiniUpData = [],
                this.MiniDownData = [],
                this.scroll = 0,
                this.scroll1 = 0,
                this.IsMove = 60,
                this.IsMove1 = 60
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.ShareBtn, this.SkipBtn]),
                this.SkinIcon.skin = "res/Icon/Skin/Skin14.png",
                this.ShareBtn.on(Laya.Event.CLICK, this, this.Share),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[15] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-4f9c25c65d91cc0d"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 13
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ]),
                i.IsMFSkinUpCallback ? this.MiniUpCallBack() : d.SendMsgToServer("export_game", [9], Laya.Handler.create(this, this.MiniUpCallBack)),
                i.IsMFSkinDownCallback ? this.MiniDownCallBack() : d.SendMsgToServer("export_game", [10], Laya.Handler.create(this, this.MiniDownCallBack))
        }
        MiniUpCallBack() {
            i.IsMFSkinUpCallback = !0,
                1 == i.ExportSwitch && 1 == i.MFSkinSwitch && i.TrySkinUpGameData.length > 0 ? (this.ExportUpTP.visible = !0, this.MiniSet()) : this.ExportUpTP.visible = !1
        }
        MiniDownCallBack() {
            i.IsMFSkinDownCallback = !0,
                1 == i.ExportSwitch && 1 == i.MFSkinSwitch && i.TrySkinDownGameData.length > 0 ? (this.ExportDownTP.visible = !0, this.MiniSet1()) : this.ExportDownTP.visible = !1
        }
        onEnable() {}
        Share() {
            n.PlaySound("click"),
                platform.getInstance().showReward(() => {
                    Laya.View.open("Scene/GetAwardPanel.scene", !1, ["MFSkin"])
                })
        }
        Skip() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[15] = !1,
                L.MFSkinBanner && L.MFSkinBanner.hide()
        }
        MiniSet() {
            this.ExportUpList.itemRender = Ie,
                this.ExportUpList.hScrollBarSkin = null,
                this.MiniUpData = i.MFSkinUpGameData,
                this.ExportUpList.array = this.MiniUpData,
                this.ExportUpList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.MiniUpScoll()
        }
        freshList1(e, t) {
            e.setShow(this.MiniUpData[t])
        }
        MiniSet1() {
            this.ExportDownList.itemRender = Ie,
                this.ExportDownList.hScrollBarSkin = null,
                this.MiniDownData = i.MFSkinDownGameData,
                this.ExportDownList.array = this.MiniDownData,
                this.ExportDownList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1),
                this.MiniDownScoll()
        }
        freshList2(e, t) {
            e.setShow(this.MiniDownData[t])
        }
        MiniUpScoll() {
            this.MiniUpData.length <= 5 || (Laya.timer.loop(30, this, this.MiniUpScollLoop), this.ExportUpList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove = 0
            }))
        }
        MiniDownScoll() {
            this.MiniDownData.length <= 5 || (Laya.timer.loop(30, this, this.MiniDownScollLoop), this.ExportDownList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove1 = 0
            }))
        }
        MiniUpScollLoop() {
            if (this.IsMove >= 60)
                if (0 == this.scroll) {
                    this.ExportUpList.scrollBar.value += 2;
                    var e = this.MiniUpData.length;
                    this.ExportUpList.scrollBar.value >= 69 * e && (this.ExportUpList.scrollBar.value = 69 * e, this.scroll = 69 * e)
                } else this.ExportUpList.scrollBar.value -= 2,
                    this.ExportUpList.scrollBar.value <= 0 && (this.ExportUpList.scrollBar.value = 0, this.scroll = 0);
            else this.IsMove++
        }
        MiniDownScollLoop() {
            if (this.IsMove1 >= 60)
                if (0 == this.scroll1) {
                    this.ExportDownList.scrollBar.value += 2;
                    var e = this.MiniDownData.length;
                    this.ExportDownList.scrollBar.value >= 69 * e && (this.ExportDownList.scrollBar.value = 69 * e, this.scroll1 = 69 * e)
                } else this.ExportDownList.scrollBar.value -= 2,
                    this.ExportDownList.scrollBar.value <= 0 && (this.ExportDownList.scrollBar.value = 0, this.scroll1 = 0);
            else this.IsMove1++
        }
    }
    class Ie extends e.Scene.ExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class we extends e.Scene.OverExportPanelUI {
        constructor() {
            super(),
                this.MiniData = []
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn, this.ReviveBtn]),
                this.ReviveBtn.on(Laya.Event.CLICK, this, this.Revive),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                N._Instance.IsStopGame = !0,
                this.MiniSet(),
                s.SetBtnBottom(this.ReviveBtn, 350),
                s.SetBtnBottom(this.SkipBtn, 280),
                L.BannerShowData[22] = !0,
                L.CreateBannerAd("adunit-daaedeb33e517be5"),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                N._Instance.IsLevelModel && (
                    2 == i.MaxLevel && 0 == i.IsTwoMFRevive ?
                    this.mffhtp.visible = !0 : 1 == i.IsMFRevive ? (
                        // this.videotp.visible = !0, 
                        // this.fhtp.visible = !0
                        null
                    ) : this.mffhtp.visible = !0)
        }
        onEnable() {}
        MiniSet() {
            this.OverExportList.itemRender = ue;
            let e = [];
            for (let t = 0; t < i.OverGameData.length; t++) e.push(t);
            let t = o.GetDataRandom({
                arry: e,
                range: 5
            });
            this.MiniData = i.OverGameData;
            for (let e = 0; e < this.MiniData.length; e++) {
                this.MiniData[e].ishd = !1;
                for (let a = 0; a < t.length; a++) e == t[a] && (this.MiniData[e].ishd = !0)
            }
            this.OverExportList.array = this.MiniData,
                this.OverExportList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.MiniData[t])
        }
        Revive() {
            n.PlaySound("click"),
                2 == i.MaxLevel && 0 == i.IsTwoMFRevive ? (
                    N._Instance.Revive(),
                    Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                    i.IsTwoMFRevive = 1,
                    r.save_int("IsTwoMFRevive", i.IsTwoMFRevive)
                ) : 1 == i.IsMFRevive ? (
                    i.IsCountDown = !1,
                    Laya.SoundManager.stopMusic(),
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM(),
                        i.IsCountDown = !0,
                            N._Instance.Revive(),
                            Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    }, () => {
                        //n.PlayBGM(),
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                        i.IsCountDown = !0
                    })
                ) : (
                    N._Instance.Revive(),
                    Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                    i.IsMFRevive = 1,
                    r.save_int("IsMFRevive", i.IsMFRevive)
                )
        }
        Skip() {
            n.PlaySound("click"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 7
                    },
                    {
                        key: "event_code_sub",
                        value: 1
                    },
                    {
                        key: "check_point",
                        value: i.MaxLevel
                    }
                ]),
                Laya.View.open("Scene/SettlePanel.scene")
        }
        onDisable() {
            N._Instance.IsStopGame = !1,
                L.BannerShowData[22] = !1,
                L.OverExportBanner && L.OverExportBanner.hide()
        }
    }
    class ue extends e.Scene.OverExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (Laya.timer.clearAll(this), Laya.Tween.clearAll(this), this.rotation = 0, this.Icon.skin = e.pathName, e.ishd ? (this.HDTP.visible = !0, Laya.timer.loop(2e3, this, this.MiniTween)) : this.HDTP.visible = !1, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                Laya.Tween.clearAll(this),
                this.rotation = 0
        }
        MiniTween() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.MiniTween1))
        }
        MiniTween1() {
            Laya.Tween.to(this, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.MiniTween2))
        }
        MiniTween2() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.MiniTween3))
        }
        MiniTween3() {
            Laya.Tween.to(this, {
                    rotation: 0
                },
                50, null)
        }
    }
    class ge extends e.Scene.OverPanelUI {
        constructor() {
            super(),
                this.endAngle = -90,
                this.CountTimer = 3,
                this.CountIndex = 30,
                this.IsShare = !1
        }
        onAwake() {
            ge._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.ReviveBtn, this.SkipBtn, this.GoHomeBtn]),
                N._Instance.IsLevelModel ?
                (
                    i.MaxLevel,
                    this.CountTimer = 3,
                    this.CountIndex = 30
                ) : (
                    N._Instance.ReviveNum++,
                    this.CountIndex = 3,
                    1 == N._Instance.ReviveNum ?
                    (
                        this.CountTimer = 5,
                        this.IsShare = !0
                    ) : 2 == N._Instance.ReviveNum ?
                    (
                        this.CountTimer = 20,
                        this.IsShare = !0
                    ) : 3 == N._Instance.ReviveNum ?
                    (
                        this.CountTimer = 25,
                        this.IsShare = !0
                    ) : 4 == N._Instance.ReviveNum ?
                    (
                        this.CountTimer = 30,
                        this.IsShare = !1
                    ) : N._Instance.ReviveNum >= 5 && (
                        this.CountTimer = 35,
                        this.IsShare = !1),
                    N._Instance.ReviveNum >= 2 && (
                        this.GoHomeBtn.visible = !1,
                        1 == i.BannerSwitch ?
                        Laya.timer.once(5e3, this, () => {
                            this.GoHomeBtn.visible = !0
                        }) :
                        this.GoHomeBtn.visible = !0
                    )
                ),
                this.Pie = new Laya.Sprite,
                this.Pie.pos(204.5, 204.5),
                this.NeiQuan.mask = this.Pie,
                this.CountTimerLabel.text = this.CountTimer.toString(),
                n.PlaySound("daojishi"),
                i.IsCountDown = !0,
                Laya.timer.loop(1e3, this, this.CountDownTimer),
                N._Instance.IsLevelModel && 3 == this.CountTimer && Laya.timer.loop(25, this, this.CountDown),
                this.ReviveBtn.on(Laya.Event.CLICK, this, this.Revive),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip, [!0]),
                this.GoHomeBtn.on(Laya.Event.CLICK, this, this.GoHome),
                N._Instance.IsLevelModel ? (
                    3 == i.MaxLevel && 0 == i.IsTwoMFRevive ?
                    this.mffhtp.visible = !0 :
                    1 == i.IsMFRevive ?
                    (
                        this.videotp.visible = !0,
                        this.fhtp.visible = !0
                    ) :
                    this.mffhtp.visible = !0,
                    1 == i.ExportSwitch && 1 == i.OverSwitch && (
                        1 == i.OverSwitchSub || i.MaxLevel >= 3
                    ) ?
                    this.SkipBtn.visible = !1 :
                    (
                        this.SkipBtn.visible = !1,
                        1 == i.BannerSwitch ?
                        Laya.timer.once(2e3, this, () => {
                            this.SkipBtn.visible = !0
                        }) :
                        this.SkipBtn.visible = !0
                    )
                ) : (
                    N._Instance.IsOverRevive = !0,
                    1 == N._Instance.ReviveNum ? this.mffhtp.visible = !0 :
                    (
                        //this.IsShare ? this.sharetp.visible = !0 : 
                        (
                            this.videotp.visible = !0,
                            this.videotp.pos(58, 57.5)
                        ),
                        this.zjfh.visible = !0
                    ),
                    this.SkipBtn.visible = !1),
                i.IsOverCallback || d.SendMsgToServer("export_game", [5], Laya.Handler.create(this, () => {
                    i.IsOverCallback = !0
                })),
                s.SetBtnBottom(this.ReviveBtn, 370),
                s.SetBtnBottom(this.SkipBtn, 280),
                s.SetBtnBottom(this.GoHomeBtn, 280),
                N._Instance.IsLevelModel ? (L.BannerShowData[2] = !0, L.CreateBannerAd("adunit-22719a8a83b82420")) : (L.BannerShowData[19] = !0, L.CreateBannerAd("adunit-ea34ab94806411e1"))
        }
        onEnable() {}
        Revive() {
            n.PlaySound("click"),
                N._Instance.IsLevelModel ? 3 == i.MaxLevel && 0 == i.IsTwoMFRevive ? (
                    N._Instance.Revive(),
                    Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                    i.IsTwoMFRevive = 1,
                    r.save_int("IsTwoMFRevive", i.IsTwoMFRevive)
                ) : 1 == i.IsMFRevive ? (
                    i.IsCountDown = !1,
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM(),
                        i.IsCountDown = !0,
                            N._Instance.Revive(),
                            Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    }, () => {
                        i.IsCountDown = !0
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                    })
                ) : (
                    N._Instance.Revive(),
                    Laya.View.open("Scene/GamePanel.scene", !0, [1]),
                    i.IsMFRevive = 1,
                    r.save_int("IsMFRevive", i.IsMFRevive)
                ) : 1 == N._Instance.ReviveNum ? (
                    N._Instance.ArenaPlayerRevive(),
                    Laya.View.open("Scene/GamePanel.scene", !0, [1])
                ) : this.IsShare ?
                (i.IsCountDown = !1,
                    N._Instance.IsStopGame = true,
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM(),
                        N._Instance.IsStopGame = false,
                            i.IsCountDown = !0,
                            N._Instance.ArenaPlayerRevive(),
                            Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    }, () => {
                        i.IsCountDown = !0
                        N._Instance.IsStopGame = false,
                            platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                        // N._Instance.ArenaPlayerRevive(),
                        // Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    })
                    // ,()=>{
                    // 	//n.PlayBGM(),
                    // 	N._Instance.ArenaPlayerRevive(),
                    // 	Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    // }
                ) : (
                    i.IsCountDown = !1,
                    Laya.SoundManager.stopMusic(),
                    N._Instance.IsStopGame = true,
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM(),
                        i.IsCountDown = !0,
                            N._Instance.IsStopGame = false,
                            N._Instance.ArenaPlayerRevive(),
                            Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    }, () => {
                        //n.PlayBGM(),
                        i.IsCountDown = !0
                        N._Instance.IsStopGame = false,
                            platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                        // N._Instance.ArenaPlayerRevive(),
                        // Laya.View.open("Scene/GamePanel.scene", !0, [1])
                    })
                )
        }
        Skip(e) {
            e && n.PlaySound("click"),
                Laya.View.open("Scene/SettlePanel.scene")
        }
        GoHome() {
            n.PlaySound("click"),
                N._Instance.ReGame(),
                Laya.View.open("Scene/StartPanel.scene")
        }
        CountDownTimer() {
            i.IsCountDown && (
                this.CountTimer--,
                this.CountTimerLabel.text = this.CountTimer.toString(),
                this.CountTimerLabelTween(),
                this.CountTimer <= 0 ? (
                    i.IsCountDown = !1,
                    N._Instance.IsLevelModel ?
                    1 == i.ExportSwitch &&
                    1 == i.OverSwitch &&
                    i.OverGameData.length > 0 &&
                    (1 == i.OverSwitchSub || i.MaxLevel >= 3) ?
                    Laya.View.open("Scene/OverExportPanel.scene", !1) :
                    this.Skip(!1) :
                    (Laya.View.open("Scene/GamePanel.scene", !0, [1]), N._Instance.ArenaPlayerRevive())
                ) : n.PlaySound("daojishi")
            )
        }
        CountDown() {
            i.IsCountDown && (this.endAngle += this.CountIndex / i.CountTimer, this.Pie.graphics.drawPie(0, 0, 180, -90, this.endAngle, "#ffffff"))
        }
        CountTimerLabelTween() {
            Laya.Tween.to(this.CountTimerLabel, {
                    scaleX: 1.2,
                    scaleY: 1.2
                },
                300, null, Laya.Handler.create(this, this.CountTimerLabelTween1))
        }
        CountTimerLabelTween1() {
            Laya.Tween.to(this.CountTimerLabel, {
                    scaleX: 1,
                    scaleY: 1
                },
                300, null)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[2] = !1,
                L.OverBanner && L.OverBanner.hide(),
                L.BannerShowData[19] = !1,
                L.ArenaOverBanner && L.ArenaOverBanner.hide(),
                N._Instance.IsOverRevive = !1
        }
    }
    class ke extends e.Scene.RankPanelUI {
        constructor() {
            super(),
                this.RankData = [],
                this.MyRankData = {}
        }
        onAwake() {
            ke._Instance = this,
                this.onShow(),
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Close),
                //this.FriendBtn.on(Laya.Event.CLICK, this, this.Friend),
                //this.RankBtn.on(Laya.Event.CLICK, this, this.Rank),
                //this.GetGoldBtn.on(Laya.Event.CLICK, this, this.GetGold),
                Laya.timer.frameLoop(1, this, this.Update),
                this.RankData = i.RankData;
            let e = {
                isself: 1
            };
            e.icon = i.Head,
                e.name = i.Name,
                e.badge = i.Badge,
                e.badgelv = i.BadgeLv,
                e.level = i.MaxLevel,
                this.MyRankData = e,
                this.RankData.push(e),
                this.RankData = this.sortFun(this.RankData),
                this.RankData.length = 100,
                this.CreateWXODW(),
                this.Rank(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[13] = !0,
                s.SetBtnBottom(this.SkipBtn, 240),
                L.CreateBannerAd("adunit-bee5766797443563")
        }
        onEnable() {}
        Friend() {
            //n.PlaySound("click"),
            //this.FriendTP.visible || (this.RankCutSet(!0, !1), X.GetFriendRank("Friend"))
        }
        Rank() {
            n.PlaySound("click"),
                this.RankTP.visible || (c.SendMsgToServer([{
                        key: "scene",
                        value: 2
                    },
                    {
                        key: "event_code",
                        value: 1
                    }
                ]), this.RankCutSet(!1, !0), this.RankSet(), this.MyRankRefresh())
        }
        MyRankRefresh() {
            let e = this.MyRankData;
            e.rank <= 3 ? (this.RankIcon.visible = !0, this.RankIcon.skin = "res/Icon/Rank/No" + e.rank + ".png", this.RankLabel.visible = !1) : (this.RankIcon.visible = !1, this.RankLabel.visible = !0, this.RankLabel.text = e.rank, e.rank > 100 && (this.RankLabel.text = "100+")),
                this.Icon.skin = e.icon,
                this.NameLabel.text = e.name,
                this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png",
                this.BadgeLabel.text = i.BadgeData[i.Badge - 1] + i.BadgeLvData[i.BadgeLv - 1],
                this.LevelLabel.text = "level" + e.level
        }
        RankSet() {
            this.RankList.itemRender = be,
                this.RankList.vScrollBarSkin = null,
                this.RankList.array = this.RankData,
                this.RankList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.RankData[t])
        }
        sortFun(e) {
            e.sort(function(e, t) {
                return e.level < t.level ? 1 : e.level > t.level ? -1 : e.level == t.level ? e.badgeindex > t.badgeindex ? 1 : e.badgeindex < t.badgeindex ? -1 : 0 : void 0
            });
            for (var t = 0; t < e.length; t++) e[t].rank = t + 1;
            return e
        }
        Close() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        RankCutSet(e, t) {
            this.WXOpenDataViewer.visible = e,
                //this.FriendTP.visible = e,
                this.RankTP.visible = t,
                //this.FriendBtn.visible = t,
                //this.RankBtn.visible = e,
                this.RankList.visible = t,
                this.MyRank.visible = t,
                //this.GetAwardBox.visible = e,
                e || X.GetFriendRank("CloseBox")
        }
        CreateWXODW() {
            this.WXOpenDataViewer = this.addChild(Laya.Pool.getItemByClass("WXOpenDataViewer", Laya.WXOpenDataViewer)),
                this.WXOpenDataViewer.width = 750,
                this.WXOpenDataViewer.height = 1334,
                this.WXOpenDataViewer.centerX = 0,
                this.WXOpenDataViewer.centerY = 0,
                this.WXOpenDataViewer.visible = !0
        }
        GetGold() {
            n.PlaySound("click"),
                i.InviteNum > 0 ? Laya.View.open("Scene/GetAwardPanel.scene", !1, ["RankGold"]) : platform.getInstance().prompt("")
        }
        Update() {
            // i.InviteNum > 0 ? (
            // 	//this.ShareGoldLabel.text = "x" + 50 * i.InviteNum
            // 	//this.GetGoldBtn.gray = !1
            // 	) : (
            // 		//this.ShareGoldLabel.text = "0"
            // 		//this.GetGoldBtn.gray = !0
            // 		)
        }
        onShow() {
            window.wx && window.wx.onShow(function(e) {
                c.SendMsgToServer([{
                            key: "scene",
                            value: 2
                        },
                        {
                            key: "event_code",
                            value: 2
                        }
                    ]),
                    Math.random() > .8 && N._Instance.UpdateInviteNum(1)
            })
        }
        onDisable() {
            L.BannerShowData[13] = !1,
                L.RankBanner && L.RankBanner.hide(),
                X.GetFriendRank("CloseBox"),
                Laya.timer.clearAll(this),
                window.wx && window.wx.offShow(),
                z._Instance.PlayerActiveCtrl(!0),
                this.WXOpenDataViewer.removeSelf(),
                Laya.Pool.recover("WXOpenDataViewer", this.WXOpenDataViewer)
        }
    }
    class be extends e.Scene.RankItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            e && (1 == e.isself ? (this.Bg1.visible = !0, this.Bg2.visible = !1) : (this.Bg1.visible = !1, this.Bg2.visible = !0), e.rank <= 3 ? (this.RankIcon.visible = !0, this.RankIcon.skin = "res/Icon/Rank/No" + e.rank + ".png", this.RankLabel.visible = !1) : (this.RankIcon.visible = !1, this.RankLabel.visible = !0, this.RankLabel.text = e.rank), this.Icon.skin = e.icon, this.NameLabel.text = e.name, this.BadgeIcon.skin = "res/Icon/Badge/Badge_0" + e.badge + ".png", this.BadgeLabel.text = i.BadgeData[e.badge - 1] + i.BadgeLvData[e.badgelv - 1], this.LevelLabel.text = "level" + e.level)
        }
    }
    class Be extends e.Scene.RecommendPanelUI {
        constructor() {
            super(),
                this.PlayerRank = 1,
                this.CurrLevel = 1,
                this.MiniUpData = [],
                this.MiniDownData = [],
                this.scroll = 0,
                this.scroll1 = 0,
                this.IsMove = 60,
                this.IsMove1 = 60
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                s.TopUIMatch(this.HYTJTP, 50),
                s.TopUIMatch(this.ExportUpList, 120),
                L.HideAllBanner(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(3e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.MiniSet(),
                this.MiniSet1()
        }
        onOpened(e) {
            e && (this.PlayerRank = e[0], this.CurrLevel = e[1])
        }
        onEnable() {}
        Skip() {
            n.PlaySound("click"),
                1 == i.ExportSwitch && i.SettleExportGameData.length > 0 && 1 == i.SettleSwitch && (1 == i.OverSwitchSub || i.MaxLevel >= 3) ? Laya.View.open("Scene/SettleExportPanel.scene", !1, [this.PlayerRank, this.CurrLevel, 1]) : (1 != this.PlayerRank ? Laya.View.open("Scene/StartPanel.scene", !0, [1, 0]) : this.CurrLevel % 10 == 0 || 6 == this.CurrLevel ? Laya.View.open("Scene/StartPanel.scene", !0, [1, 1]) : Laya.View.open("Scene/StartPanel.scene", !0, [1, 2]), N._Instance.ReGame(), c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 7
                    },
                    {
                        key: "event_code_sub",
                        value: 2
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ]))
        }
        onDisable() {}
        MiniSet() {
            this.ExportUpList.itemRender = xe,
                this.ExportUpList.hScrollBarSkin = null,
                this.MiniUpData = i.SettleTJUpGameData,
                this.ExportUpList.array = this.MiniUpData,
                this.ExportUpList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.MiniUpScoll()
        }
        freshList1(e, t) {
            e.setShow(this.MiniUpData[t])
        }
        MiniSet1() {
            this.ExportDownList.itemRender = Te,
                this.ExportDownList.vScrollBarSkin = null,
                this.MiniDownData = i.SettleTJDownGameData,
                this.ExportDownList.array = this.MiniDownData,
                this.ExportDownList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1),
                this.MiniDownScoll()
        }
        freshList2(e, t) {
            e.setShow(this.MiniDownData[t])
        }
        MiniUpScoll() {
            this.MiniUpData.length <= 4 || (Laya.timer.loop(30, this, this.MiniUpScollLoop), this.ExportUpList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove = 0
            }))
        }
        MiniDownScoll() {
            this.MiniDownData.length <= 6 || (Laya.timer.loop(30, this, this.MiniDownScollLoop), this.ExportDownList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove1 = 0
            }))
        }
        MiniUpScollLoop() {
            if (this.IsMove >= 60)
                if (0 == this.scroll) {
                    this.ExportUpList.scrollBar.value += 2;
                    var e = this.MiniUpData.length;
                    this.ExportUpList.scrollBar.value >= 90.833333 * e && (this.ExportUpList.scrollBar.value = 90.833333 * e, this.scroll = 90.833333 * e)
                } else this.ExportUpList.scrollBar.value -= 2,
                    this.ExportUpList.scrollBar.value <= 0 && (this.ExportUpList.scrollBar.value = 0, this.scroll = 0);
            else this.IsMove++
        }
        MiniDownScollLoop() {
            if (this.IsMove1 >= 60)
                if (0 == this.scroll1) {
                    this.ExportDownList.scrollBar.value += 2;
                    var e = this.MiniDownData.length;
                    this.ExportDownList.scrollBar.value >= 82.5 * e && (this.ExportDownList.scrollBar.value = 82.5 * e, this.scroll1 = 82.5 * e)
                } else this.ExportDownList.scrollBar.value -= 2,
                    this.ExportDownList.scrollBar.value <= 0 && (this.ExportDownList.scrollBar.value = 0, this.scroll1 = 0);
            else this.IsMove1++
        }
    }
    class xe extends e.Scene.TJUpItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.NameLabel.text = e.name, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class Te extends e.Scene.TJDownItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.NameLabel.text = e.name, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class Ce extends e.Scene.SetPanelUI {
        constructor() {
            super()
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.CloseBtn, this.MusicOffBtn, this.MusicOpenBtn, this.SoundOffBtn, this.SoundOpenBtn]),
                this.MusicOffBtn.on(Laya.Event.CLICK, this, this.MusicOff),
                this.MusicOpenBtn.on(Laya.Event.CLICK, this, this.MusicOpen),
                this.SoundOffBtn.on(Laya.Event.CLICK, this, this.SoundOff),
                this.SoundOpenBtn.on(Laya.Event.CLICK, this, this.SoundOpen),
                //this.VibratorOffBtn.on(Laya.Event.CLICK, this, this.VibratorOff),
                //this.VibratorOpenBtn.on(Laya.Event.CLICK, this, this.VibratorOpen),
                this.CloseBtn.on(Laya.Event.CLICK, this, this.Close),
                i.IsMusic ? (this.MusicOffBtn.visible = !1, this.MusicOpenBtn.visible = !0) : (this.MusicOffBtn.visible = !0, this.MusicOpenBtn.visible = !1),
                i.IsSound ? (this.SoundOffBtn.visible = !1, this.SoundOpenBtn.visible = !0) : (this.SoundOffBtn.visible = !0, this.SoundOpenBtn.visible = !1),
                //i.IsVibrate ? (this.VibratorOffBtn.visible = !1, this.VibratorOpenBtn.visible = !0) : (this.VibratorOffBtn.visible = !0, this.VibratorOpenBtn.visible = !1),
                L.BannerShowData[9] = !0,
                L.CreateBannerAd("adunit-7045d7763f9ea9e4")
        }
        onEnable() {}
        MusicOff() {
            n.PlaySound("click"),
                i.IsMusic = !0,
                n.PlayBGM1(),
                this.MusicOffBtn.visible = !1,
                this.MusicOpenBtn.visible = !0
        }
        MusicOpen() {
            n.PlaySound("click"),
                i.IsMusic = !1,
                n.StopBGM1(),
                this.MusicOffBtn.visible = !0,
                this.MusicOpenBtn.visible = !1
        }
        SoundOff() {
            n.PlaySound("click"),
                i.IsSound = !0,
                this.SoundOffBtn.visible = !1,
                this.SoundOpenBtn.visible = !0
        }
        SoundOpen() {
            n.PlaySound("click"),
                i.IsSound = !1,
                this.SoundOffBtn.visible = !0,
                this.SoundOpenBtn.visible = !1
        }
        VibratorOff() {
            // n.PlaySound("click"),
            // i.IsVibrate = !0,
            // this.VibratorOffBtn.visible = !1,
            // this.VibratorOpenBtn.visible = !0
        }
        VibratorOpen() {
            // n.PlaySound("click"),
            // i.IsVibrate = !1,
            // this.VibratorOffBtn.visible = !0,
            // this.VibratorOpenBtn.visible = !1
        }
        Close() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        onDisable() {
            z._Instance.PlayerActiveCtrl(!0),
                L.BannerShowData[9] = !1,
                L.SetBanner && L.SetBanner.hide()
        }
    }
    class De extends e.Scene.SettleExportPanelUI {
        constructor() {
            super(),
                this.IsOk = !1,
                this.PlayerRank = 1,
                this.CurrLevel = 1,
                this.BackType = 1,
                this.MiniData = []
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                this.TotalBg.width = Laya.stage.width,
                this.TotalBg.height = Laya.stage.height - 45,
                this.TotalBg.centerX = 0,
                this.TotalBg.bottom = 0,
                //s.TopUIMatch(this.SettleExportList, 120),
                s.TopUIMatch(this.TopBox, 0);
            let e = a.PhoneMsg;
            20 == e.statusBarHeight || (40 == e.statusBarHeight || 44 == e.statusBarHeight || 48 == e.statusBarHeight || 29 == e.statusBarHeight || Laya.stage.height / Laya.stage.width > 2.1) && (this.TotalBg.bottom -= 65),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Back),
                this.MiniSet(),
                //s.SetBtnBottom(this.SkipBtn, 280),
                L.BannerShowData[23] = !0,
                L.CreateBannerAd("adunit-e5b692486d06346e")
        }
        onOpened(e) {
            e && (this.PlayerRank = e[0], this.CurrLevel = e[1], this.BackType = e[2], this.IsOk = !0)
        }
        onEnable() {}
        MiniSet() {
            platform.getInstance().initList(this.SettleExportList);
        }
        freshList1(e, t) {
            e.setShow(this.MiniData[t])
        }
        Back() {
            n.PlaySound("click"),
                this.IsOk && (1 == this.BackType ? (1 != this.PlayerRank ? Laya.View.open("Scene/StartPanel.scene", !0, [1, 0]) : this.CurrLevel % 10 == 0 || 6 == this.CurrLevel ? Laya.View.open("Scene/StartPanel.scene", !0, [1, 1]) : Laya.View.open("Scene/StartPanel.scene", !0, [1, 2]), N._Instance.ReGame(), c.SendMsgToServer([{
                        key: "scene",
                        value: 1
                    },
                    {
                        key: "event_code",
                        value: 7
                    },
                    {
                        key: "event_code_sub",
                        value: 2
                    },
                    {
                        key: "check_point",
                        value: this.CurrLevel
                    }
                ])) : 2 == this.BackType ? Laya.View.open("Scene/StartPanel.scene") : 3 == this.BackType ? this.close() : 4 == this.BackType && (z && z._Instance && z._Instance.PlayerActiveCtrl(!0), Laya.View.open("Scene/StartPanel.scene")))
        }
        onDisable() {
            L.BannerShowData[23] = !1,
                L.SettleExportBanner && L.SettleExportBanner.hide()
        }
    }
    class Me extends e.Scene.SettleExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (Laya.timer.clearAll(this), Laya.Tween.clearAll(this), this.rotation = 0, this.Icon.skin = e.pathName, this.NameLabel.text = e.name, e.ishd ? (this.HDTP.visible = !0, Laya.timer.loop(2e3, this, this.MiniTween)) : this.HDTP.visible = !1, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index, 2)
        }
        onDisable() {
            Laya.timer.clearAll(this),
                Laya.Tween.clearAll(this),
                this.rotation = 0
        }
        MiniTween() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                50, null, Laya.Handler.create(this, this.MiniTween1))
        }
        MiniTween1() {
            Laya.Tween.to(this, {
                    rotation: -10
                },
                100, null, Laya.Handler.create(this, this.MiniTween2))
        }
        MiniTween2() {
            Laya.Tween.to(this, {
                    rotation: 10
                },
                100, null, Laya.Handler.create(this, this.MiniTween3))
        }
        MiniTween3() {
            Laya.Tween.to(this, {
                    rotation: 0
                },
                50, null)
        }
    }
    class Pe extends e.Scene.SettleLotteryPanelUI {
        constructor() {
            super(),
                this.IsLottery = !1,
                this.ExpDouble = 0,
                this.DengIndex = 0,
                this.DoubleBoxNum = 1
        }
        onAwake() {
            Pe._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.GetAwardBtn, this.SkipBtn, this.CloseBtn]),
                this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAward),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.CloseBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.videotp.visible = !0,
                this.videotp.pos(82, 56.5),
                this.lqtp.visible = !0,
                this.zcyctp.visible = !1,
                this.fqtp.visible = !0,
                this.zjlqtp.visible = !1,
                this.SkipBtn.visible = !1,
                this.CloseBtn.visible = !1,
                this.RefreshUI(),
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                this.DengTP1.visible = !0,
                this.DengTP2.visible = !1,
                Laya.timer.frameLoop(8, this, this.AlterDeng),
                s.SetBtnBottom(this.GetAwardBtn, 370),
                L.BannerShowData[4] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-dbbf28f2c1bd0615"),
                this.GetAwardCallBack()
        }
        onEnable() {}
        GetAward() {
            n.PlaySound("click"),
                this.IsLottery ? platform.getInstance().prompt("In the lottery...") : (
                    platform.getInstance().showReward(() => {
                        this.GetAwardCallBack()
                    })
                )
        }
        GetAwardCallBack() {
            n.PlaySound("Luck"),
                this.Refresh(),
                this.IsLottery = !0;
            let e = 2,
                t = Math.random();
            t <= .69 ? e = 2 : t > .69 && t <= .7 ? e = 10 : t > .7 && t <= .9 ? e = 3 : t > .9 && t <= .98 ? e = 4 : t > .98 && (e = 5),
                Laya.Tween.to(this.ZhuanPan, {
                        rotation: this.GetZhuanPanRot(e)
                    },
                    6e3, Laya.Ease.cubicOut, Laya.Handler.create(this, () => {
                        Laya.SoundManager.stopSound("GameScene/Sound/Luck.mp3"),
                            Laya.timer.once(300, this, () => {
                                let t;
                                switch (this.IsLottery = !1, this.DoubleBoxNum) {
                                    case 1:
                                        t = this.YiBox;
                                        break;
                                    case 2:
                                        t = this.ErBox;
                                        break;
                                    case 3:
                                        t = this.SanBox;
                                        break;
                                    case 4:
                                        t = this.SiBox;
                                        break;
                                    case 5:
                                        t = this.WuBox;
                                        break;
                                    case 6:
                                        t = this.LiuBox
                                }
                                this.DoubleBoxTween(t),
                                    platform.getInstance().prompt("Congratulations on getting " + e + " times exp！"),
                                    this.ExpDouble = e,
                                    this.RefreshUI()
                            })
                    }))
        }
        Skip() {
            n.PlaySound("click"),
                this.IsLottery ? platform.getInstance().prompt("In the lottery...") : (
                    this.close(),
                    0 != this.ExpDouble && Laya.View.open("Scene/GetAwardPanel.scene", !1, ["SettleLottery", this.ExpDouble]))
        }
        Refresh() {
            this.ZhuanPan.rotation = 0,
                Laya.Tween.clearAll(this.YiBox),
                Laya.Tween.clearAll(this.ErBox),
                Laya.Tween.clearAll(this.SanBox),
                Laya.Tween.clearAll(this.SiBox),
                Laya.Tween.clearAll(this.WuBox),
                Laya.Tween.clearAll(this.LiuBox)
        }
        RefreshUI() {
            this.videotp.visible = !0,
                this.videotp.pos(57, 56.5),
                this.lqtp.visible = !1,
                this.zcyctp.visible = !0,
                this.fqtp.visible = !1,
                this.zjlqtp.visible = !0
        }
        AlterDeng() {
            this.DengIndex++,
                this.DengIndex % 2 == 0 ? (this.DengTP2.visible = !0, this.DengTP1.visible = !1) : (this.DengTP2.visible = !1, this.DengTP1.visible = !0)
        }
        GetZhuanPanRot(e) {
            let t = 1800,
                a = 0;
            switch (e) {
                case 2:
                    a = 40 * Math.random() + 130,
                        this.DoubleBoxNum = 4;
                    break;
                case 3:
                    Math.random() > .5 ? (a = 40 * Math.random() + 70, this.DoubleBoxNum = 5) : (a = 40 * Math.random() + 190, this.DoubleBoxNum = 3);
                    break;
                case 4:
                    a = 40 * Math.random() + 250,
                        this.DoubleBoxNum = 2;
                    break;
                case 5:
                    a = 40 * Math.random() + 10,
                        this.DoubleBoxNum = 6;
                    break;
                case 10:
                    a = 40 * Math.random() + 310,
                        this.DoubleBoxNum = 1
            }
            return t += a
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[4] = !1,
                L.LotteryBanner && L.LotteryBanner.hide()
        }
        DoubleBoxTween(e) {
            Laya.Tween.to(e, {
                    scaleX: 1.1,
                    scaleY: 1.1
                },
                1e3, null, Laya.Handler.create(this, this.DoubleBoxTween1, [e]))
        }
        DoubleBoxTween1(e) {
            Laya.Tween.to(e, {
                    scaleX: 1,
                    scaleY: 1
                },
                1e3, null, Laya.Handler.create(this, this.DoubleBoxTween, [e]))
        }
    }
    class _e extends e.Scene.SettleSharePanelUI {
        constructor() {
            super()
        }
        onAwake() {
            _e._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn]),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.CreateWXODW(),
                X.GetFriendRank("SettleShare"),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[17] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-248ddfe90a55b858")
        }
        onEnable() {}
        Skip() {
            n.PlaySound("click"),
                this.close(),
                L.BannerShowData[3] = !0,
                L.CreateBannerAd("adunit-c465d47c15eafdad")
        }
        CreateWXODW() {
            this.WXOpenDataViewer = this.addChild(Laya.Pool.getItemByClass("WXOpenDataViewer", Laya.WXOpenDataViewer)),
                this.WXOpenDataViewer.width = 750,
                this.WXOpenDataViewer.height = 1334,
                this.WXOpenDataViewer.centerX = 0,
                this.WXOpenDataViewer.centerY = 0,
                this.WXOpenDataViewer.visible = !0
        }
        onDisable() {
            L.BannerShowData[17] = !1,
                L.SettleShareBanner && L.SettleShareBanner.hide(),
                X.GetFriendRank("CloseBox"),
                this.WXOpenDataViewer.removeSelf(),
                Laya.Pool.recover("WXOpenDataViewer", this.WXOpenDataViewer)
        }
    }
    class Ae extends e.Scene.SignPanelUI {
        constructor() {
            super(),
                this.SignData = [],
                this.IsDouble = !0
        }
        onAwake() {
            Ae._Instance = this,
                s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.GetAwardBtn, this.SkipBtn]),
                this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAward),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Close),
                this.KuangBtn.on(Laya.Event.CLICK, this, this.Kuang),
                this.GouBtn.on(Laya.Event.CLICK, this, this.Gou),
                this.Refresh(),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[5] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-ed5606a607b8413e"),
                c.SendMsgToServer([{
                        key: "scene",
                        value: 3
                    },
                    {
                        key: "event_code",
                        value: 1
                    },
                    {
                        key: "event_code_sub",
                        value: 1
                    }
                ])
        }
        onEnable() {}
        Refresh() {
            this.SignData = [];
            for (let e = 1; e <= 7; e++) {
                let t = {};
                switch (t.day = e, e) {
                    case 1:
                        t.isdouble = 1,
                            t.award = [1, 5],
                            t.awardnum = [100, 50];
                        break;
                    case 2:
                        t.isdouble = 0,
                            t.award = [1, 3],
                            t.awardnum = [200, 1];
                        break;
                    case 3:
                        t.isdouble = 1,
                            t.award = [1, 5],
                            t.awardnum = [300, 50];
                        break;
                    case 4:
                        t.isdouble = 1,
                            t.award = [1, 5],
                            t.awardnum = [100, 100];
                        break;
                    case 5:
                        t.isdouble = 1,
                            t.award = [1, 2],
                            t.awardnum = [300, 3];
                        break;
                    case 6:
                        t.isdouble = 1,
                            t.award = [1, 5],
                            t.awardnum = [100, 200];
                        break;
                    case 7:
                        t.isdouble = 0,
                            0 == i.IsSevenDay ? (t.award = [1, 5, 4], t.awardnum = [100, 100, 1]) : (t.award = [5, 3], t.awardnum = [100, 1])
                }
                e < i.CurrSignDay ? t.issign = 1 : t.issign = 0,
                    e == i.CurrSignDay ? (t.iscurrsign = 1, 1 == i.IsSign && (t.issign = 1)) : t.iscurrsign = 0,
                    this.SignData.push(t)
            }
            for (let e = 0; e < this.SignData.length; e++)
                if (1 == this.SignData[e].iscurrsign) {
                    1 == this.SignData[e].isdouble ? this.IsDouble = !0 : this.IsDouble = !1;
                    break
                }
            1 == i.IsSign ? (this.ylq.visible = !0, this.lq.visible = !1, this.sblq.visible = !1, this.GetAwardBtn.gray = !0, this.DoubleLabelBox.visible = !1) : (this.GetAwardBtn.gray = !1, this.IsDouble ? (this.sblq.visible = !0, this.DoubleLabelBox.visible = !0, this.GouBtn.visible = !0, this.GouTP.visible = !0, this.KuangBtn.visible = !1) : this.lq.visible = !0),
                this.SignSet()
        }
        SignSet() {
            this.SignList.itemRender = Ee,
                this.SignList.vScrollBarSkin = null,
                this.SignList.array = this.SignData,
                this.SignList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1)
        }
        freshList1(e, t) {
            e.setShow(this.SignData[t])
        }
        GetAward() {
            n.PlaySound("click"),
                1 == i.IsSign ? platform.getInstance().prompt("Received today!") :
                this.IsDouble ? (
                    Laya.SoundManager.stopMusic(),
                    platform.getInstance().showReward(() => {
                        //n.PlayBGM1(),
                        this.GetAwardCallBack(2)
                    }, () => {
                        //n.PlayBGM1(),
                        platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.")
                    })
                ) :
                (c.SendMsgToServer([{
                        key: "scene",
                        value: 3
                    },
                    {
                        key: "event_code",
                        value: 2
                    },
                    {
                        key: "event_code_sub",
                        value: 0
                    }
                ]), this.GetAwardCallBack(1))
        }
        GetAwardCallBack(e) {
            for (let t = 0; t < this.SignData.length; t++)
                if (this.SignData[t].day == i.CurrSignDay) {
                    Laya.View.open("Scene/GetAwardPanel.scene", !1, ["Sign", this.SignData[t], e]);
                    break
                }
            N._Instance.UpdateSignData(),
                this.Refresh()
        }
        Close() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene"),
                0 == i.IsRefuseYQ && 1 == i.IsTwoDay && (z && z._Instance && z._Instance.PlayerActiveCtrl(!1), Laya.View.open("Scene/TeamInvitePanel.scene", !1))
        }
        Kuang() {
            n.PlaySound("click"),
                this.IsDouble = !0,
                this.KuangBtn.visible = !1,
                this.GouBtn.visible = !0,
                this.GouTP.visible = !0,
                this.lq.visible = !1,
                this.sblq.visible = !0
        }
        Gou() {
            n.PlaySound("click"),
                this.IsDouble = !1,
                this.KuangBtn.visible = !0,
                this.GouBtn.visible = !1,
                this.GouTP.visible = !1,
                this.lq.visible = !0,
                this.sblq.visible = !1
        }
        onDisable() {
            z._Instance.PlayerActiveCtrl(!0),
                L.BannerShowData[5] = !1,
                L.SignBanner && L.SignBanner.hide()
        }
    }
    class Ee extends e.Scene.SignItemUI {
        constructor() {
            super()
        }
        setShow(e) {
            if (e) {
                for (let e = 0; e < this.numChildren; e++) this.getChildAt(e).visible = !1;
                if (7 == e.day ? (this.daytp.pos(156, 49), 1 == e.iscurrsign ? this.bg4.visible = !0 : this.bg2.visible = !0, 1 == e.issign && (this.zz2.visible = !0, this.lyqtp.visible = !0, this.lyqtp.pos(312, 100))) : (this.daytp.pos(43, 49), 1 == e.iscurrsign ? this.bg3.visible = !0 : this.bg1.visible = !0, 1 == e.issign && (this.zz1.visible = !0, this.lyqtp.visible = !0, this.lyqtp.pos(100, 100))), this.daytp.skin = "res/Icon/Sign/Sign" + e.day + ".png", this.daytp.visible = !0, e.award.length <= 2)
                    if (7 != e.day) {
                        switch (e.award[0]) {
                            case 1:
                                this.jbtp.visible = !0,
                                    this.goldlabel.visible = !0,
                                    this.goldlabel.text = "x" + e.awardnum[0]
                        }
                        switch (e.award[1]) {
                            case 2:
                                this.tltp.visible = !0,
                                    this.proplabel.visible = !0,
                                    this.proplabel.text = "x" + e.awardnum[1];
                                break;
                            case 3:
                                this.sptp.visible = !0,
                                    this.sptp.pos(151, 90),
                                    this.sptp.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png",
                                    this.proplabel.visible = !0,
                                    this.proplabel.text = "x" + e.awardnum[1];
                                break;
                            case 5:
                                this.zstp.visible = !0,
                                    this.proplabel.visible = !0,
                                    this.proplabel.text = "x" + e.awardnum[1]
                        }
                    } else {
                        switch (e.award[0]) {
                            case 5:
                                this.zstp.visible = !0,
                                    this.zstp.pos(246, 90),
                                    this.diamondlabel.visible = !0,
                                    this.diamondlabel.pos(246, 152),
                                    this.diamondlabel.text = "x" + e.awardnum[0]
                        }
                        switch (e.award[1]) {
                            case 3:
                                this.sptp.visible = !0,
                                    this.sptp.pos(406, 85),
                                    this.sptp.skin = "res/Icon/SkinDebris/Debris" + i.SkinDebrisOrderData[i.SkinDebrisOrderIndex] + ".png",
                                    this.proplabel.visible = !0,
                                    this.proplabel.pos(406, 152),
                                    this.proplabel.text = "x" + e.awardnum[1]
                        }
                    }
                else this.jbtp.visible = !0,
                    this.jbtp.pos(206, 90),
                    this.goldlabel.visible = !0,
                    this.goldlabel.pos(206, 152),
                    this.goldlabel.text = "x" + e.awardnum[0],
                    this.zstp.visible = !0,
                    this.zstp.pos(326, 85),
                    this.diamondlabel.visible = !0,
                    this.diamondlabel.pos(326, 152),
                    this.diamondlabel.text = "x" + e.awardnum[1],
                    this.jstp.visible = !0,
                    this.jstp.skin = "res/Icon/Skin/Skin15.png",
                    this.proplabel.visible = !0,
                    this.proplabel.pos(446, 152),
                    this.proplabel.text = "x" + e.awardnum[2]
            }
        }
    }
    class Ge extends e.Scene.TeamInvitePanelUI {
        constructor() {
            super(),
                this.IsRefuse = !1
            this.isOpenAward = false
        }
        onEnable() {
            this.isOpenAward = false
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.SkipBtn, this.OkBtn]),
                this.kuangtp.visible = !0,
                this.kuangbtn.visible = !0,
                this.goutp.visible = !1,
                this.goubtn.visible = !1,
                this.Icon.skin = "res/Icon/Head/" + o.GetNonredundantNum()[0] + ".jpg",
                this.OkBtn.on(Laya.Event.CLICK, this, this.Ok),
                this.goubtn.on(Laya.Event.CLICK, this, this.gou),
                this.kuangbtn.on(Laya.Event.CLICK, this, this.kuang),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                L.BannerShowData[24] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-bff4443d7ff4c756")
        }
        Ok() {
            n.PlaySound("click")
            if (this.isOpenAward) return;
            i.IsLoadTailsRes && i.IsLoadFloorRes && i.IsLoadPropRes ? (
                i.IsZJKFJJC ? i.Power >= 2 ?
                platform.getInstance().showInterstitial(() => {
                    (Laya.SoundManager.stopMusic(),
                        N._Instance.UpdatePower(-2),
                        Laya.View.open("Scene/ArenaMatePanel.scene"))
                }) :
                (
                    this.isOpenAward = true,
                    platform.getInstance().prompt("Lack of strength!", 500),
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false,
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetPower", 2])
                        }
                    })
                ) : i.Badge >= 1 && i.BadgeLv >= 2 || i.Badge >= 2 ? i.Power >= 2 ?
                platform.getInstance().showInterstitial(() => {
                    (N._Instance.ArenaLoadMonsterRes(),
                        Laya.SoundManager.stopMusic(),
                        N._Instance.UpdatePower(-2),
                        Laya.View.open("Scene/ArenaMatePanel.scene"))
                }) :
                (
                    this.isOpenAward = true,
                    platform.getInstance().prompt("Lack of strength!", 500),
                    Laya.timer.once(500, this, () => {
                        if (this.isOpenAward) {
                            this.isOpenAward = false,
                                Laya.View.open("Scene/GetAwardPanel.scene", !1, ["GetPower", 2])
                        }
                    })
                ) : (Laya.View.open("Scene/StartPanel.scene"),
                    platform.getInstance().prompt("Your level is not enough, please upgrade to bronze II!"))) : platform.getInstance().prompt("Resource loading...")
        }
        gou() {
            n.PlaySound("click"),
                this.IsRefuse = !1,
                this.kuangbtn.visible = !0,
                this.goutp.visible = !1,
                this.goubtn.visible = !1
        }
        kuang() {
            n.PlaySound("click"),
                this.IsRefuse = !0,
                this.kuangbtn.visible = !1,
                this.goutp.visible = !0,
                this.goubtn.visible = !0
        }
        Skip() {
            n.PlaySound("click"),
                Laya.View.open("Scene/StartPanel.scene")
        }
        AlterState() {
            this.IsRefuse && (i.IsRefuseYQ = 1, r.save_int("IsRefuseYQ", i.IsRefuseYQ), i.IsRefuseYQTime = new Date((new Date).toLocaleDateString()).getTime() / 1e3 + 86400, r.save_int("IsRefuseYQTime", i.IsRefuseYQTime))
        }
        onDisable() {
            this.AlterState(),
                L.BannerShowData[24] = !1,
                L.ZuDuiBanner && L.ZuDuiBanner.hide()
        }
    }
    class Re extends e.Scene.TrySkinPanelUI {
        constructor() {
            super(),
                this.TrySkinData = [],
                this.IsMF = !1,
                this.MiniUpData = [],
                this.MiniDownData = [],
                this.scroll = 0,
                this.scroll1 = 0,
                this.IsMove = 60,
                this.IsMove1 = 60
        }
        onAwake() {
            if (s.MatchScreen(this, this.Bg), s.AddBtnAnimation([this.ShareBtn, this.VideoBtn, this.SkipBtn]), N._Instance.LoadEffectRes(), 3 == i.MaxLevel) this.TrySkinData = o.GetDataRandom({
                arry: [12, 24, 25],
                range: 2
            });
            else if (5 == i.MaxLevel) this.TrySkinData = o.GetDataRandom({
                arry: [8, 12, 18, 24, 25],
                range: 2
            });
            else {
                let e = [];
                for (let t = 1; t <= 27; t++) e.push(t);
                this.TrySkinData = o.GetDataRandom({
                    arry: o.GetArrDifference(i.SkinData, e),
                    range: 2
                })
            }
            this.Skin1Icon.skin = "res/Icon/Skin/Skin" + this.TrySkinData[0] + ".png",
                this.Skin1Label.text = i.AniamlNameData[this.TrySkinData[0] - 1],
                this.Skin2Icon.skin = "res/Icon/Skin/Skin" + this.TrySkinData[1] + ".png",
                this.Skin2Label.text = i.AniamlNameData[this.TrySkinData[1] - 1],
                5 == i.MaxLevel ? (
                    this.IsMF = !0,
                    this.sharetp.visible = !1,
                    this.fxsy.visible = !1,
                    this.videotp.visible = !1,
                    this.spsy.visible = !1,
                    this.mfsy1.visible = !0,
                    this.mfsy2.visible = !0
                ) : (
                    this.IsMF = !1,
                    this.sharetp.visible = !0,
                    this.fxsy.visible = !0,
                    this.videotp.visible = !0,
                    this.spsy.visible = !0,
                    this.mfsy1.visible = !1,
                    this.mfsy2.visible = !1
                ),
                this.ShareBtn.on(Laya.Event.CLICK, this, this.Share),
                this.VideoBtn.on(Laya.Event.CLICK, this, this.Video),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[14] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-2a28850d40f9b47e"),
                i.IsTrySkinUpCallback ? this.MiniUpCallBack() : d.SendMsgToServer("export_game", [3], Laya.Handler.create(this, this.MiniUpCallBack)),
                i.IsTrySkinDownCallback ? this.MiniDownCallBack() : d.SendMsgToServer("export_game", [4], Laya.Handler.create(this, this.MiniDownCallBack))
        }
        MiniUpCallBack() {
            i.IsTrySkinUpCallback = !0,
                1 == i.ExportSwitch && 1 == i.TrySkinSwitch && i.TrySkinUpGameData.length > 0 ? (this.ExportUpTP.visible = !0, this.MiniSet()) : this.ExportUpTP.visible = !1
        }
        MiniDownCallBack() {
            i.IsTrySkinDownCallback = !0,
                1 == i.ExportSwitch && 1 == i.TrySkinSwitch && i.TrySkinDownGameData.length > 0 ? (this.ExportDownTP.visible = !0, this.MiniSet1()) : this.ExportDownTP.visible = !1
        }
        onEnable() {}
        Share() {
            n.PlaySound("click"),
                this.IsMF ? (platform.getInstance().prompt("Congratulations,you can experience " + i.AniamlNameData[this.TrySkinData[0] - 1] + " skin  this time!"), N._Instance.PlayerTrySkinId = this.TrySkinData[0], N._Instance.StartGame()) : X.ShareApp([0, 1, 2, 3, 4, 5], "TrySkin", Laya.Handler.create(this, () => {
                    c.SendMsgToServer([{
                                key: "scene",
                                value: 1
                            },
                            {
                                key: "event_code",
                                value: 9
                            },
                            {
                                key: "event_code_sub",
                                value: 1
                            }
                        ]),
                        platform.getInstance().prompt("Congratulations,you can experience " + i.AniamlNameData[this.TrySkinData[0] - 1] + " skin  this time!"),
                        N._Instance.PlayerTrySkinId = this.TrySkinData[0],
                        N._Instance.StartGame()
                }))
        }
        Video() {
            n.PlaySound("click"),
                this.IsMF ? (
                    platform.getInstance().prompt("Congratulations on getting " + i.AniamlNameData[this.TrySkinData[1] - 1] + " Skin single game experience opportunity!"),
                    N._Instance.PlayerTrySkinId = this.TrySkinData[1],
                    N._Instance.StartGame()
                ) : (
                    platform.getInstance().showReward(() => {
                        platform.getInstance().prompt("Congratulations on getting " + i.AniamlNameData[this.TrySkinData[1] - 1] + " Skin single game experience opportunity!"),
                            N._Instance.PlayerTrySkinId = this.TrySkinData[1],
                            N._Instance.StartGame()
                    })
                )
        }
        Skip() {
            n.PlaySound("click"),
                N._Instance.PlayerTrySkinId = 0,
                N._Instance.StartGame()
        }
        onDisable() {
            Laya.timer.clearAll(this),
                L.BannerShowData[14] = !1,
                L.TrySkinBanner && L.TrySkinBanner.hide()
        }
        MiniSet() {
            this.ExportUpList.itemRender = Ve,
                this.ExportUpList.hScrollBarSkin = null,
                this.MiniUpData = i.TrySkinUpGameData,
                this.ExportUpList.array = this.MiniUpData,
                this.ExportUpList.renderHandler = Laya.Handler.create(this, this.freshList1, null, !1),
                this.MiniUpScoll()
        }
        freshList1(e, t) {
            e.setShow(this.MiniUpData[t])
        }
        MiniSet1() {
            this.ExportDownList.itemRender = Ve,
                this.ExportDownList.hScrollBarSkin = null,
                this.MiniDownData = i.TrySkinDownGameData,
                this.ExportDownList.array = this.MiniDownData,
                this.ExportDownList.renderHandler = Laya.Handler.create(this, this.freshList2, null, !1),
                this.MiniDownScoll()
        }
        freshList2(e, t) {
            e.setShow(this.MiniDownData[t])
        }
        MiniUpScoll() {
            this.MiniUpData.length <= 5 || (Laya.timer.loop(30, this, this.MiniUpScollLoop), this.ExportUpList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove = 0
            }))
        }
        MiniDownScoll() {
            this.MiniDownData.length <= 5 || (Laya.timer.loop(30, this, this.MiniDownScollLoop), this.ExportDownList.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.IsMove1 = 0
            }))
        }
        MiniUpScollLoop() {
            if (this.IsMove >= 60)
                if (0 == this.scroll) {
                    this.ExportUpList.scrollBar.value += 2;
                    var e = this.MiniUpData.length;
                    this.ExportUpList.scrollBar.value >= 69 * e && (this.ExportUpList.scrollBar.value = 69 * e, this.scroll = 69 * e)
                } else this.ExportUpList.scrollBar.value -= 2,
                    this.ExportUpList.scrollBar.value <= 0 && (this.ExportUpList.scrollBar.value = 0, this.scroll = 0);
            else this.IsMove++
        }
        MiniDownScollLoop() {
            if (this.IsMove1 >= 60)
                if (0 == this.scroll1) {
                    this.ExportDownList.scrollBar.value += 2;
                    var e = this.MiniDownData.length;
                    this.ExportDownList.scrollBar.value >= 69 * e && (this.ExportDownList.scrollBar.value = 69 * e, this.scroll1 = 69 * e)
                } else this.ExportDownList.scrollBar.value -= 2,
                    this.ExportDownList.scrollBar.value <= 0 && (this.ExportDownList.scrollBar.value = 0, this.scroll1 = 0);
            else this.IsMove1++
        }
    }
    class Ve extends e.Scene.ExportItemUI {
        constructor() {
            super()
        }
        onAwake() {
            s.AddBtnAnimation([this])
        }
        setShow(e) {
            e && (this.Icon.skin = e.pathName, this.on(Laya.Event.CLICK, this, this.OnClick, [e]))
        }
        OnClick(e) {
            n.PlaySound("click"),
                d.SendMsgToServer("game_event", [e.list_type, e.location_index, 1]),
                X.SkipMiniGame(e.appId, e.path, e.list_type, e.location_index)
        }
    }
    class He extends e.Scene.VideoDowerPanelUI {
        constructor() {
            super(),
                this.UpLvType = 1
        }
        onAwake() {
            s.MatchScreen(this, this.Bg),
                s.AddBtnAnimation([this.VideoLvBtn, this.SkipBtn]),
                this.VideoLvBtn.on(Laya.Event.CLICK, this, this.VideoLv),
                this.SkipBtn.on(Laya.Event.CLICK, this, this.Skip),
                this.SkipBtn.visible = !1,
                1 == i.BannerSwitch ? Laya.timer.once(2e3, this, () => {
                    this.SkipBtn.visible = !0
                }) : this.SkipBtn.visible = !0,
                L.BannerShowData[6] = !0,
                s.SetBtnBottom(this.SkipBtn, 280),
                L.CreateBannerAd("adunit-139fc91faf13e7ff")
        }
        onOpened(e) {
            if (e) {
                let t = e[0];
                switch (this.UpLvType = t.dowertype, t.dowertype) {
                    case 1:
                        this.CurrlvLabel.text = "Tail Length:+" + t.dowerlv,
                            this.NextlvLabel.text = "+" + (t.dowerlv + 1);
                        break;
                    case 2:
                        this.CurrlvLabel.text = "Move Speed:+" + 5 * t.dowerlv + "%",
                            this.NextlvLabel.text = "+" + 5 * (t.dowerlv + 1) + "%";
                        break;
                    case 3:
                        0 == t.dowerlv ?
                            (
                                this.CurrlvLabel.text = "Init Volume:+0%",
                                this.NextlvLabel.text = "+10%"
                            ) : (
                                this.CurrlvLabel.text = "Init Volume:+" + (5 + 5 * t.dowerlv) + "%",
                                this.NextlvLabel.text = "+" + (5 + 5 * (t.dowerlv + 1)) + "%"
                            )
                }
            }
        }
        onEnable() {}
        VideoLv() {
            n.PlaySound("click"),
                Laya.SoundManager.stopMusic(),
                platform.getInstance().showReward(() => {
                    //n.PlayBGM1(),
                    platform.getInstance().prompt("Upgrade Successfully!"),
                        N._Instance.UpdateDowerLv(this.UpLvType),
                        ie._Instance.DowerSet(),
                        this.close()
                }, () => {
                    platform.getInstance().prompt("Failed to get the reward, please watch the ads to the end.");
                    //n.PlayBGM1()
                })
        }
        GetDowerLv(e) {
            for (let t = 0; t < i.DowerData.length; t++)
                if (i.DowerData[t].dowertype == e) {
                    return i.DowerData[t].dowerlv + 1
                }
        }
        Skip() {
            n.PlaySound("click"),
                this.close()
        }
        onDisable() {
            L.BannerShowData[6] = !1,
                L.SkinBanner && L.SkinBanner.hide()
        }
    }
    class Oe {
        constructor() {}
        static init() {
            var e = Laya.ClassUtils.regClass;
            e("Scripts/UI/ArenaAwardPanel.ts", Y),
                e("Scripts/UI/ArenaMatePanel.ts", j),
                e("Scripts/UI/ArenaSettlePanel.ts", W),
                e("Scripts/UI/BadgeLvPanel.ts", $),
                e("Scripts/UI/BossSharePanel.ts", ee),
                e("Scripts/UI/BuffPanel.ts", te),
                e("Scripts/UI/DowerPanel.ts", ie),
                e("Scripts/UI/GamePanel.ts", v),
                e("Scripts/UI/GetAwardPanel.ts", ye),
                e("Scripts/UI/LoadingPanel.ts", Le),
                e("Scripts/UI/LotteryPanel.ts", ce),
                e("Scripts/UI/MFSkinPanel.ts", ve),
                e("Scripts/UI/OverExportPanel.ts", we),
                e("Scripts/UI/OverPanel.ts", ge),
                e("Scripts/UI/RankPanel.ts", ke),
                e("Scripts/UI/RecommendPanel.ts", Be),
                e("Scripts/UI/SetPanel.ts", Ce),
                e("Scripts/UI/SettleExportPanel.ts", De),
                e("Scripts/UI/SettleLotteryPanel.ts", Pe),
                e("Scripts/UI/SettlePanel.ts", ne),
                e("Scripts/UI/SettleSharePanel.ts", _e),
                e("Scripts/UI/SignPanel.ts", Ae),
                e("Scripts/UI/SkinPanel.ts", de),
                e("Scripts/UI/SkinShopPanel.ts", re),
                e("Scripts/UI/StartPanel.ts", z),
                e("Scripts/UI/TeamInvitePanel.ts", Ge),
                e("Scripts/UI/TrySkinPanel.ts", Re),
                e("Scripts/UI/VideoDowerPanel.ts", He)
        }
    }
    Oe.width = 750,
        Oe.height = 1334,
        Oe.scaleMode = "showall",
        Oe.screenMode = "none",
        Oe.alignV = "middle",
        Oe.alignH = "center",
        Oe.startScene = "Scene/LoadingPanel.scene",
        Oe.sceneRoot = "",
        Oe.debug = !1,
        Oe.stat = !1,
        Oe.physicsDebug = !1,
        Oe.exportSceneToJson = !0,
        Oe.init();
    new class {
        constructor() {
            window.Laya3D ? Laya3D.init(Oe.width, Oe.height) : Laya.init(Oe.width, Oe.height, Laya.WebGL),
                Laya.Physics && Laya.Physics.enable(),
                Laya.DebugPanel && Laya.DebugPanel.enable(),
                Laya.stage.scaleMode = Oe.scaleMode,
                Laya.stage.screenMode = Oe.screenMode,
                Laya.stage.alignV = Oe.alignV,
                Laya.stage.alignH = Oe.alignH,
                Laya.URL.exportSceneToJson = Oe.exportSceneToJson,
                (Oe.debug || "true" == Laya.Utils.getQueryString("debug")) && Laya.enableDebugPanel(),
                Oe.physicsDebug && Laya.PhysicsDebugDraw && Laya.PhysicsDebugDraw.enable(),
                Oe.stat && Laya.Stat.show(),
                Laya.alertGlobalError = !1,
                Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION)
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded))
        }
        onConfigLoaded() {
            X.GetInitMsg(),
                Oe.startScene && Laya.Scene.open(Oe.startScene)
                GAMESDK.recordOpen();
            Se.Init()
        }
    }
}();
GAMESDK.startup()
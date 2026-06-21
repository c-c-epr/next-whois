import requests
import random
import time

providers = [
    {"domain": "who.zmh.me", "times": []},
    {"domain": "who.ccepr.dev", "times": []},
    {"domain": "whowho.zeabur.app", "times": []},
    {"domain": "who-package.ccepr.ccwu.cc", "times": []},
    {"domain": "w.is", "times": []},
    {"domain": "caddy.ccepr.ccwu.cc", "times": []},
]

domains = [
    {"rank": 1, "domain": "google.com", "categories": "Search Engines"},
    {
        "rank": 2,
        "domain": "googleapis.com",
        "categories": "Information Technology;Content Servers",
    },
    {"rank": 3, "domain": "cloudflare.com", "categories": "Technology"},
    {"rank": 4, "domain": "gstatic.com", "categories": "Content Servers"},
    {
        "rank": 5,
        "domain": "apple.com",
        "categories": "Information Technology;Technology",
    },
    {
        "rank": 6,
        "domain": "microsoft.com",
        "categories": "Information Technology;Business",
    },
    {"rank": 7, "domain": "facebook.com", "categories": "Social Networks"},
    {"rank": 8, "domain": "amazonaws.com", "categories": "Technology"},
    {
        "rank": 9,
        "domain": "googlevideo.com",
        "categories": "Search Engines;Video Streaming",
    },
    {"rank": 10, "domain": "fbcdn.net", "categories": "Social Networks"},
    {"rank": 11, "domain": "amazon.com", "categories": "Ecommerce"},
    {"rank": 12, "domain": "youtube.com", "categories": "Video Streaming"},
    {
        "rank": 13,
        "domain": "whatsapp.net",
        "categories": "Instant Messengers;Internet Phone & VOIP",
    },
    {"rank": 14, "domain": "instagram.com", "categories": "Social Networks"},
    {"rank": 15, "domain": "doubleclick.net", "categories": "Advertisements"},
    {"rank": 16, "domain": "apple-dns.net", "categories": "Content Servers"},
    {"rank": 17, "domain": "akadns.net", "categories": "Content Servers"},
    {"rank": 18, "domain": "live.com", "categories": "Technology;Webmail"},
    {"rank": 19, "domain": "bing.com", "categories": "Search Engines"},
    {"rank": 20, "domain": "netflix.com", "categories": "Movies;Video Streaming"},
    {"rank": 21, "domain": "ntp.org", "categories": "Technology;Government/Legal"},
    {"rank": 22, "domain": "googleusercontent.com", "categories": "Content Servers"},
    {"rank": 23, "domain": "icloud.com", "categories": "File Sharing;Content Servers"},
    {
        "rank": 24,
        "domain": "googlesyndication.com",
        "categories": "Search Engines;Advertisements",
    },
    {"rank": 25, "domain": "cloudflare-dns.com", "categories": "Content Servers"},
    {"rank": 26, "domain": "cdninstagram.com", "categories": "Content Servers"},
    {"rank": 27, "domain": "chatgpt.com", "categories": "Artificial Intelligence;Chat"},
    {
        "rank": 28,
        "domain": "aaplimg.com",
        "categories": "Information Technology;Content Servers;Technology",
    },
    {"rank": 29, "domain": "akamai.net", "categories": "Content Servers"},
    {
        "rank": 30,
        "domain": "tiktokcdn.com",
        "categories": "Content Servers;Social Networks",
    },
    {
        "rank": 31,
        "domain": "tiktokv.com",
        "categories": "Social Networks;Video Streaming",
    },
    {"rank": 32, "domain": "cloudfront.net", "categories": "Content Servers"},
    {"rank": 33, "domain": "ui.com", "categories": "Technology"},
    {"rank": 34, "domain": "ytimg.com", "categories": "Content Servers"},
    {"rank": 35, "domain": "akamaiedge.net", "categories": "Content Servers"},
    {"rank": 36, "domain": "edgcdn.net", "categories": "Content Servers"},
    {"rank": 37, "domain": "yahoo.com", "categories": "News & Media"},
    {"rank": 38, "domain": "gvt2.com", "categories": "Content Servers"},
    {"rank": 39, "domain": "spotify.com", "categories": "Audio Streaming"},
    {
        "rank": 40,
        "domain": "fastly.net",
        "categories": "Information Security;Information Technology;Technology",
    },
    {"rank": 41, "domain": "gvt1.com", "categories": "Content Servers"},
    {"rank": 42, "domain": "samsung.com", "categories": "Home & Garden;Technology"},
    {"rank": 43, "domain": "roblox.com", "categories": "Gaming;Safe for Kids"},
    {"rank": 44, "domain": "office.com", "categories": "Business"},
    {"rank": 45, "domain": "criteo.com", "categories": "Business"},
    {"rank": 46, "domain": "sentry.io", "categories": "Business"},
    {"rank": 47, "domain": "baidu.com", "categories": "Search Engines"},
    {"rank": 48, "domain": "prodregistryv2.org", "categories": "Content Servers"},
    {"rank": 49, "domain": "app-measurement.com", "categories": "APIs"},
    {
        "rank": 50,
        "domain": "app-analytics-services.com",
        "categories": "Content Servers",
    },
    {"rank": 51, "domain": "wikipedia.org", "categories": "Education;Reference"},
    {"rank": 52, "domain": "dns.google", "categories": "Information Technology"},
    {"rank": 53, "domain": "one.one", "categories": "Information Technology"},
    {"rank": 54, "domain": "steamserver.net", "categories": "Gaming;Content Servers"},
    {"rank": 55, "domain": "google-analytics.com", "categories": "Business;Technology"},
    {"rank": 56, "domain": "msftncsi.com", "categories": "Content Servers"},
    {"rank": 57, "domain": "snapchat.com", "categories": "Photography;Social Networks"},
    {
        "rank": 58,
        "domain": "trafficmanager.net",
        "categories": "Information Technology;Content Servers",
    },
    {"rank": 59, "domain": "3gppnetwork.org", "categories": "Content Servers"},
    {"rank": 60, "domain": "applovin.com", "categories": "Business;Technology"},
    {"rank": 61, "domain": "appsflyersdk.com", "categories": "Content Servers;APIs"},
    {"rank": 62, "domain": "azure.com", "categories": "Technology"},
    {"rank": 63, "domain": "msn.com", "categories": "News & Media"},
    {
        "rank": 64,
        "domain": "whatsapp.com",
        "categories": "Instant Messengers;Internet Phone & VOIP",
    },
    {"rank": 65, "domain": "windows.com", "categories": "Information Technology"},
    {"rank": 66, "domain": "amazon-adsystem.com", "categories": "Advertisements"},
    {"rank": 67, "domain": "googletagmanager.com", "categories": "Content Servers"},
    {"rank": 68, "domain": "googleadservices.com", "categories": "Advertisements"},
    {"rank": 69, "domain": "amazon.dev", "categories": "Content Servers"},
    {"rank": 70, "domain": "ggpht.com", "categories": "Content Servers"},
    {"rank": 71, "domain": "windows.net", "categories": "Technology"},
    {"rank": 72, "domain": "linkedin.com", "categories": "Professional Networking"},
    {"rank": 73, "domain": "microsoftonline.com", "categories": "Technology"},
    {"rank": 74, "domain": "unity3d.com", "categories": "Gaming;Technology"},
    {"rank": 75, "domain": "oxylabs.io", "categories": "Business;Technology"},
    {"rank": 76, "domain": "a2z.com", "categories": "Content Servers"},
    {"rank": 77, "domain": "adtrafficquality.google", "categories": "Search Engines"},
    {"rank": 78, "domain": "xiaomi.com", "categories": "Technology"},
    {
        "rank": 79,
        "domain": "skype.com",
        "categories": "Instant Messengers;Internet Phone & VOIP",
    },
    {"rank": 80, "domain": "playstation.net", "categories": "Gaming"},
    {"rank": 81, "domain": "rubiconproject.com", "categories": "Business;Technology"},
    {"rank": 82, "domain": "msftconnecttest.com", "categories": "Content Servers"},
    {"rank": 83, "domain": "vungle.com", "categories": "Business;Technology"},
    {"rank": 84, "domain": "taboola.com", "categories": "Business;Advertisements"},
    {
        "rank": 85,
        "domain": "windowsupdate.com",
        "categories": "Information Technology;Business",
    },
    {"rank": 86, "domain": "capcutapi.com", "categories": "Content Servers"},
    {
        "rank": 87,
        "domain": "cloud.microsoft",
        "categories": "Information Technology;Business",
    },
    {"rank": 88, "domain": "digicert.com", "categories": "Information Security"},
    {"rank": 89, "domain": "qq.com", "categories": "News & Media"},
    {
        "rank": 90,
        "domain": "tiktok.com",
        "categories": "Social Networks;Video Streaming",
    },
    {"rank": 91, "domain": "gmail.com", "categories": "Webmail"},
    {"rank": 92, "domain": "aws.dev", "categories": "Content Servers"},
    {"rank": 93, "domain": "cdn-apple.com", "categories": "Content Servers"},
    {"rank": 94, "domain": "miui.com", "categories": "Technology"},
    {"rank": 95, "domain": "pubmatic.com", "categories": "Business;Technology"},
    {
        "rank": 96,
        "domain": "cloudflare.net",
        "categories": "Information Technology;Technology",
    },
    {"rank": 97, "domain": "android.com", "categories": "Technology"},
    {"rank": 98, "domain": "avast.com", "categories": "Technology"},
    {"rank": 99, "domain": "adsrvr.org", "categories": "Advertisements"},
    {"rank": 100, "domain": "reddit.com", "categories": "Forums"},
]

for domain in domains[:10]:
    print(f"\nTesting {domain['domain']}")

    # 每次都隨機排序
    for provider in random.sample(providers, len(providers)):
        start_time = time.perf_counter()

        try:
            response = requests.get(
                f"https://{provider['domain']}/api/lookup?query={domain['domain']}",
                timeout=10,
            )

            elapsed = time.perf_counter() - start_time
            provider["times"].append(elapsed)

            print(
                f"{provider['domain']:30} "
                f"status={response.status_code} "
                f"time={elapsed:.3f}s"
            )

        except Exception as e:
            print(f"{provider['domain']:30} ERROR: {e}")

print("\n=== Summary ===")

for provider in providers:
    if provider["times"]:
        avg = sum(provider["times"]) / len(provider["times"])
        print(
            f"{provider['domain']:30} "
            f"avg={avg:.3f}s "
            f"min={min(provider['times']):.3f}s "
            f"max={max(provider['times']):.3f}s"
        )

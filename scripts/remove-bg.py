import os, sys
from PIL import Image, ImageFilter
from collections import deque

def dist(a,b):
    return ((a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2)**0.5

def remove_bg(path, out_png, thr=42):
    im = Image.open(path).convert('RGB')
    w,h = im.size
    px = im.load()
    # fundo = media dos cantos
    corners = [px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1]]
    bg = tuple(int(sum(c[i] for c in corners)/4) for i in range(3))
    mask = Image.new('L', (w,h), 255)
    mp = mask.load()
    visited = bytearray(w*h)
    q = deque()
    # seed bordas
    for x in range(w):
        for y in (0, h-1):
            if dist(px[x,y], bg) < thr:
                q.append((x,y)); visited[y*w+x]=1
    for y in range(h):
        for x in (0, w-1):
            if dist(px[x,y], bg) < thr and not visited[y*w+x]:
                q.append((x,y)); visited[y*w+x]=1
    while q:
        x,y = q.popleft()
        mp[x,y] = 0
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0<=nx<w and 0<=ny<h and not visited[ny*w+nx]:
                if dist(px[nx,ny], bg) < thr:
                    visited[ny*w+nx]=1
                    q.append((nx,ny))
    # suavizar borda
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2))
    # limiar suave
    mask = mask.point(lambda v: 0 if v<40 else (255 if v>200 else v))
    # compor RGBA
    rgba = im.convert('RGBA')
    rgba.putalpha(mask)
    os.makedirs(os.path.dirname(out_png), exist_ok=True)
    rgba.save(out_png)
    print('saved', out_png)

if __name__ == '__main__':
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    imgs = ['green-pill.jpg','speed-racer.jpg','white-ghost.jpg','violet-star.jpg']
    for f in imgs:
        remove_bg(os.path.join(base,'assets','img',f), os.path.join(base,'assets','img',f.replace('.jpg','.png')))
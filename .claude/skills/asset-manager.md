# Asset Manager Skill

**Purpose:** Load, manage, and organize 3D models, animations, textures, and audio files

**When to use this skill:**
- Adding new 3D models (GLB/GLTF/FBX)
- Adding new character animations
- Loading textures or audio files
- Assets not loading correctly
- Need to organize or optimize assets

## Context

**Current Asset Inventory:**
- 20+ GLB/GLTF models (~350MB)
- 15+ FBX animations (~150MB)
- 2 MP3 audio files (~8MB)
- Textures in 2020-bmw-m8-coupe/ folder

**Asset Loaders:**
- GLTFLoader (3D models)
- FBXLoader (character animations)
- AudioLoader (music and sound effects)
- TextureLoader (images, textures)

## Key Files
- `game.js` lines 3805-4007: EnvironmentManager
- `game.js` lines 4009-4338: Character loading functions
- Various `.glb` and `.fbx` files in root directory

## Asset Loading Patterns

### Loading a GLB Model
```javascript
const loader = new GLTFLoader();
loader.load(
    'model-name.glb',
    (gltf) => {
        const model = gltf.scene;
        model.position.set(x, y, z);
        model.scale.set(sx, sy, sz);
        scene.add(model);
        console.log('Model loaded successfully');
    },
    (progress) => {
        // Optional: Show loading progress
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percent}%`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);
```

### Loading an FBX Animation
```javascript
const fbxLoader = new FBXLoader();
fbxLoader.load('animation-name.fbx', (fbx) => {
    const model = fbx;

    // CRITICAL: Remove mixamorigHips.position track
    if (fbx.animations.length > 0) {
        const clip = fbx.animations[0];
        clip.tracks = clip.tracks.filter(track =>
            track.name !== 'mixamorigHips.position'
        );
    }

    // Setup animation mixer
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(fbx.animations[0]);
    action.play();

    // Manually position model
    model.position.set(0, 1.0, 0);
    scene.add(model);
});
```

### Loading Audio
```javascript
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('sound-file.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
});
```

## Common Tasks

### Task 1: Add New 3D Model

**Steps:**
1. Place GLB file in project root directory
2. Open game.js and find EnvironmentManager section (lines 3805+)
3. Create a new loading function following the pattern
4. Position and scale the model appropriately
5. Add to scene at correct position
6. Test in game

**Example locations to add models:**
- Level 1: Tunnel obstacles (add to obstacle pool)
- Level 2: Urban environment objects
- Pickups: New collectible items
- Vehicles: New car models

### Task 2: Add New Character Animation

**Steps:**
1. Download animation from Mixamo "With Skin"
2. Place FBX file in project root
3. Load via FBXLoader
4. **CRITICAL:** Remove mixamorigHips.position track
5. Add to character's animation actions
6. Test animation loop (watch for flashing)

**Animation naming convention:**
- `jammer_[action].fbx` for player
- `[Action Name].fbx` for enemy/NPCs
- Lowercase with underscores preferred

### Task 3: Optimize Asset Sizes

**Texture Optimization:**
```bash
# Reduce texture resolution
# Use online tools or ImageMagick

# Example: Resize to 1024x1024
convert texture.png -resize 1024x1024 texture-optimized.png

# Convert to JPG (lossy but smaller)
convert texture.png -quality 85 texture.jpg
```

**Model Optimization:**
1. Open model in Blender
2. Select model
3. Add Modifier > Decimate
4. Set ratio (0.5 = 50% fewer polygons)
5. Apply modifier
6. File > Export > glTF 2.0 (.glb)

**Animation Optimization:**
- Reduce keyframe count (in Blender: Graph Editor > Decimate)
- Remove unnecessary bones
- Use lower FPS (30 instead of 60)

### Task 4: Organize Assets

**Recommended Structure:**
```
/Users/paulbridges/stevo/
├── assets/
│   ├── models/
│   │   ├── characters/
│   │   ├── vehicles/
│   │   ├── environment/
│   │   └── props/
│   ├── animations/
│   │   ├── player/
│   │   └── enemies/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   └── textures/
├── game.js
├── index.html
└── game.html
```

**Benefits:**
- Easier to find assets
- Clearer what each file is for
- Prevents root directory clutter
- Better for version control

### Task 5: Add Loading Screen

**Why:** Large assets (500MB) need visible progress feedback

**Implementation:**
```javascript
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, loaded, total) => {
    console.log(`Loading: ${loaded}/${total}`);
};

loadingManager.onProgress = (url, loaded, total) => {
    const percent = (loaded / total) * 100;
    document.getElementById('loading-bar').style.width = percent + '%';
    document.getElementById('loading-text').textContent = Math.floor(percent) + '%';
};

loadingManager.onLoad = () => {
    document.getElementById('loading-screen').style.display = 'none';
    console.log('All assets loaded');
};

loadingManager.onError = (url) => {
    console.error('Error loading:', url);
};

// Use with loaders
const gltfLoader = new GLTFLoader(loadingManager);
const fbxLoader = new FBXLoader(loadingManager);
```

## Asset Sources

### Free 3D Models
- **Sketchfab:** https://sketchfab.com (filter by downloadable)
- **Poly Haven:** https://polyhaven.com (high-quality, CC0)
- **Free3D:** https://free3d.com
- **TurboSquid:** https://turbosquid.com (some free)

### Character Animations
- **Mixamo:** https://mixamo.com (FREE, massive library)
  - Used extensively in this project
  - Download "With Skin" to keep textures
  - FBX format recommended

### Audio
- **Freesound:** https://freesound.org
- **OpenGameArt:** https://opengameart.org
- **Free Music Archive:** https://freemusicarchive.org

### Textures
- **Poly Haven:** https://polyhaven.com/textures
- **Textures.com:** (limited free)
- **CC0 Textures:** https://cc0textures.com

## Troubleshooting

### Model Not Appearing
**Possible causes:**
1. File path incorrect
2. Model loaded but positioned off-screen
3. Model scale too small or too large
4. Camera not pointed at model
5. Model has no materials (invisible)

**Debug:**
```javascript
loader.load('model.glb', (gltf) => {
    const model = gltf.scene;
    console.log('Model loaded:', model);
    console.log('Position:', model.position);
    console.log('Scale:', model.scale);
    console.log('Children:', model.children);

    // Make sure it's visible
    model.traverse(child => {
        if (child.isMesh) {
            console.log('Mesh found:', child.name);
            child.material.visible = true;
        }
    });

    scene.add(model);
});
```

### Animation Not Playing
**See:** animation-debugger.md skill for detailed guidance

**Quick checks:**
- Mixer update being called?
- Action.play() called?
- Action.enabled === true?
- mixamorigHips.position removed?

### Texture Not Showing
**Possible causes:**
1. Texture path incorrect in model
2. Texture file missing
3. CORS issue (use local server)
4. Texture format not supported

**Solution:**
- Host assets on same server as game
- Check browser console for CORS errors
- Use PNG or JPG textures
- Embed textures in GLB (use glTF-Binary export)

### Audio Not Playing
**Possible causes:**
1. Browser autoplay policy (requires user interaction)
2. Audio file path incorrect
3. Audio format not supported (use MP3 for compatibility)
4. AudioListener not added to camera

## Best Practices

1. **Use GLB over GLTF** - Single file, embedded textures
2. **Compress before deploying** - Use Draco or gzip
3. **Progressive loading** - Load gameplay assets first
4. **Test on mobile** - Large assets = long mobile load times
5. **Provide feedback** - Show loading progress
6. **Handle errors** - Don't let app break if asset fails
7. **Version control** - Track asset versions, not just code
8. **Document assets** - Keep list of sources and licenses

## Success Criteria

- ✅ Assets load without errors
- ✅ Loading time reasonable (<5 seconds)
- ✅ Assets properly positioned and scaled
- ✅ Textures display correctly
- ✅ Animations play smoothly
- ✅ Audio plays when expected
- ✅ No CORS or file path errors
- ✅ Assets organized logically

## Notes

- **Always test on local server** (python -m http.server)
- **File:// protocol causes CORS issues** with assets
- **Mixamo FBX requires position track removal** (see animation-debugger.md)
- **GLB includes textures** - Easier than GLTF + separate images
- **Audio requires user interaction** to play (browser policy)

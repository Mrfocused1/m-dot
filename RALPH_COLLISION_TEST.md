# 🔍 Ralph's Collision Box Verification Test

## Quick Test (30 seconds)

1. **Open game with all cars:**
   ```
   http://localhost:8001/?v=2&vwtsi=2&audi=2&rover=2&merc=2&fiesta=2&mode=test
   ```

2. **Open DevTools Console** (Cmd+Option+J)

3. **Paste this code:**
   ```javascript
   // Find all collision box meshes in the scene
   const collisionBoxes = [];
   scene.traverse((obj) => {
       if (obj.geometry && obj.geometry.type === 'BoxGeometry' &&
           obj.material && obj.material.wireframe) {
           collisionBoxes.push({
               position: { x: obj.position.x.toFixed(2), z: obj.position.z.toFixed(2) },
               scale: {
                   x: obj.scale.x.toFixed(3),
                   y: obj.scale.y.toFixed(3),
                   z: obj.scale.z.toFixed(3)
               },
               size: {
                   width: (obj.geometry.parameters.width * obj.scale.x).toFixed(3),
                   height: (obj.geometry.parameters.height * obj.scale.y).toFixed(3),
                   depth: (obj.geometry.parameters.depth * obj.scale.z).toFixed(3)
               }
           });
       }
   });

   console.log('='.repeat(70));
   console.log(`Found ${collisionBoxes.length} collision boxes`);
   console.log('='.repeat(70));

   collisionBoxes.forEach((box, i) => {
       const volume = parseFloat(box.size.width) * parseFloat(box.size.height) * parseFloat(box.size.depth);
       const status = volume > 10 ? '🔴 HUGE' : volume < 0.1 ? '✅ TINY' : '⚠️  MEDIUM';

       console.log(`${i + 1}. Position: X=${box.position.x}, Z=${box.position.z}`);
       console.log(`   Size: ${box.size.width} × ${box.size.height} × ${box.size.depth}`);
       console.log(`   Volume: ${volume.toFixed(4)} ${status}\n`);
   });
   ```

4. **Check the output:**
   - ✅ **GOOD:** All boxes show "TINY" with volume < 0.01
   - 🔴 **BAD:** Some boxes show "HUGE" with volume > 10

## Expected Results (After My Fix)

All 5 car collision boxes should be TINY:
- VW T-Cross TSI: 0.066 × 0.154 × 0.059 (volume: ~0.0006)
- Audi RS6: 0.073 × 0.187 × 0.055 (volume: ~0.0008)
- Range Rover: 0.071 × 0.163 × 0.060 (volume: ~0.0007)
- Mercedes A45: 0.067 × 0.164 × 0.055 (volume: ~0.0006)
- Ford Fiesta: 0.065 × 0.149 × 0.056 (volume: ~0.0005)

## What Ralph Fixed

✅ Changed all V2 collision boxes from ~1-5 units to ~0.05-0.2 units (10x smaller)
✅ V2 boxes are now 100x smaller in volume than V1

## If Boxes Are Still HUGE

That means:
1. Browser cache - try **Cmd+Shift+R** (hard refresh)
2. Wrong URL - make sure you're using `?vwtsi=2&audi=2` etc.
3. Both V1 and V2 loading - need to debug the router logic

---

**Ralph says:** "I'm helping! Run this test and tell me what you see!"

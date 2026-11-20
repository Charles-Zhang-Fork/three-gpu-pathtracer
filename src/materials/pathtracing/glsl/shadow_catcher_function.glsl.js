export const shadow_catcher_function = /* glsl */`

	// The share of the light reaching a point that is not blocked: the lights and the environment sampled as next event
	// estimation samples them, each sample weighted by what it would bring to an upward-facing white diffuse surface, so
	// a blocked sun darkens it more than a blocked patch of dim sky. A few samples are taken per path so the ratio is
	// of sums rather than of single samples.
	float shadowCatcherVisibility( RenderState state, vec3 origin, vec3 normal ) {

		const vec3 LUMA = vec3( 0.2126, 0.7152, 0.0722 );
		float total = 0.0;
		float lit = 0.0;
		for ( int k = 0; k < 4; k ++ ) {

			sobolBounceIndex ++;
			vec3 direction = vec3( 0.0, 1.0, 0.0 );
			float dist = INFINITY;
			float weight = 0.0;
			if ( lightsDenom != 0.0 && rand( 5 ) < float( lights.count ) / lightsDenom ) {

				LightRecord lightRec = randomLightSample( lights.tex, iesProfiles, lights.count, origin, rand3( 6 ) );
				direction = lightRec.direction;
				dist = lightRec.dist;
				float cosine = dot( normal, direction );
				if ( lightRec.pdf > 0.0 && cosine > 0.0 ) {

					weight = dot( lightRec.emission, LUMA ) * cosine * lightsDenom / lightRec.pdf;

				}

			} else if ( envMapInfo.totalSum != 0.0 && environmentIntensity != 0.0 ) {

				vec3 envColor;
				float envPdf = sampleEquirectProbability( rand2( 7 ), envColor, direction );
				direction = invEnvRotation3x3 * direction;
				float cosine = dot( normal, direction );
				if ( envPdf > 0.0 && cosine > 0.0 ) {

					weight = environmentIntensity * dot( envColor, LUMA ) * cosine * lightsDenom / envPdf;

				}

			}

			if ( weight > 0.0 ) {

				Ray shadowRay;
				shadowRay.origin = origin;
				shadowRay.direction = direction;
				vec3 attenuated;
				total += weight;
				if ( ! attenuateHit( state, shadowRay, dist, attenuated ) ) {

					lit += weight * dot( attenuated, LUMA );

				}

			}

		}

		return total > 0.0 ? lit / total : 1.0;

	}

`;
